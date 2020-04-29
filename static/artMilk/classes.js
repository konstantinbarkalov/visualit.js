class UniquePolys {
  dictionary = {};
  getUid(point) {
    return JSON.stringify(point.coords);
  }
  addValue(point, obj) {
    const uid = this.getUid(point);
    this.dictionary[uid] = obj;
  }
  getValue(point) {
    const uid = this.getUid(point);
    return this.dictionary[uid];
  }

}


