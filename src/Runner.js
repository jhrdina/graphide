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
      Cls[hdr.name] = undefined;
    } else {
      Cls.prototype[hdr.name] = undefined;
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
      this.classes[oldClass.get('name')] = undefined;
      this.classes[grClass.get('name')] = tmp;
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

  static run(mainPath) {
    const parts = mainPath.split('.');
    if (parts.length < 2) {
      console.error('Main path is invalid');
      return;
    }

    window[parts[0]][parts[1]]();
  }
}
