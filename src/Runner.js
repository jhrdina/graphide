// Copyright (C) 2018 Jan Hrdina
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

const parseHeader = (header) => {
  const info = {
    static: false,
    name: '',
    arguments: [],
  };

  const parts = header.trim().split(/[ ,()]+/);

  parts.forEach((part, i) => {
    if (i === 0 && part === 'static') {
      info.static = true;
    } else if (!info.name) {
      info.name = part;
    } else {
      if (info.arguments.indexOf(part) !== -1) {
        console.error(`Duplicate arg ${part}`, part);
        return;
      }
      info.arguments.push(part);
    }
  });

  if (!info.name) {
    console.error(`Missing method name in header ${header}`);
    return info;
  }

  return info;
};

const removeFromClass = (Cls, grClass) => {
  grClass.get('methods').forEach((method) => {
    const hdr = parseHeader(method.get('header'));
    if (hdr.static) {
      delete Cls[hdr.name];
    } else {
      delete Cls.prototype[hdr.name];
    }
  });
};

const addToClass = (Cls, grClass) => {
  grClass.get('methods').forEach((method) => {
    const hdr = parseHeader(method.get('header'));
    const f = new Function(...hdr.arguments, method.get('body'));
    if (hdr.static) {
      Cls[hdr.name] = f;
    } else {
      Cls.prototype[hdr.name] = f;
    }
  });
};

export default class Runner {
  // onLog(text)

  classes = {};
  defaultProto = Object.prototype;

  updateClass(grClass, oldClass) {
    if (oldClass.get('name') !== grClass.get('name')) {
      const tmp = this.classes[oldClass.get('name')];
      delete this.classes[oldClass.get('name')];
      delete window[oldClass.get('name')];
      this.classes[grClass.get('name')] = tmp;
      window[grClass.get('name')] = tmp;
    }

    const Cls = this.classes[grClass.get('name')];
    removeFromClass(Cls, oldClass);
    addToClass(Cls, grClass);
  }

  addClasses(grClasses) {
    grClasses.forEach(grClass => this.addClass(grClass));
  }

  addClass(grClass) {
    const name = grClass.get('name');
    if (this.classes[name]) {
      console.error(`Class ${name} already exists`);
      return;
    }
    const Cls = function () {};
    addToClass(Cls, grClass);
    this.classes[name] = Cls;
    window[name] = Cls;
  }

  removeClass(grClass) {
    const name = grClass.get('name');
    delete this.classes[name];
    delete window[name];
  }

  static run(mainPath) {
    const parts = mainPath.split('.');
    if (parts.length < 2) {
      console.error('Main path is invalid');
      return;
    }

    window[parts[0]][parts[1]]();
  }
}
