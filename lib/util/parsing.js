"use strict";

const _ = require("./lodash");

module.exports = function(str) {
  return {
    str: str,
    arr: [],

    findBetween(start, end = "\n") {
      try {
        this.str = this.str
          .split(start)[1]
          .split(end)[0]
          .trim();
      } catch (err) {
        this.str = "";
      }
      return this;
    },

    first() {
      const first = this.arr[0];
      this.str = first;
      this.arr = [first];
      return this;
    },

    toObject(lineDilem = "\n") {
      const obj = {};
      this.split(lineDilem);
      this.arr.forEach(line => {
        const segs = line.split(":");
        const key = segs[0].trim();
        const val = line.replace(`${key}:`, "").trim();
        obj[key] = val;
      });
      return obj;
    },

    replace(search, replace = "") {
      this.str = this.str.replace(search, replace).trim();
      this.arr = this.arr.map(item => item.replace(search, replace));
      return this;
    },

    toKeyVal() {
      const segs = this.str.split(":");
      const key = segs[0];
      const val = this.str.replace(`${key}:`, "").trim();
      return { key, val };
    },

    map(fn) {
      this.arr = this.arr.map(fn);
      return this;
    },

    odd(fn) {
      this.arr.map((item, index) => (index & 1 ? fn(item) : item));
      return this;
    },

    join(char = ",") {
      this.str = this.arr.join(char);
      return this;
    },

    removeReturns() {
      this.arr = this.arr.map(item => _removeLineBreaks);
      return this;
    },

    last() {
      const last = _.last(this.arr);
      this.str = last;
      this.arr = [last];
      return this;
    },

    split(splitOn = "\n") {
      this.arr = this.str
        .split(splitOn)
        .filter(seg => !_.isEmpty(seg))
        .map(seg => seg.trim());
      return this;
    },
  };
};

const _escapeJSON = str => str.replace(/\\/g, "\\");
const _removeLineBreaks = str => str.replace(/\n|\r/g, " ");
