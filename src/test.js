var cursorx = db.getCollection('events').find(
  {
    createdAt: {
      $gt: ISODate('2022-01-17T00:00:00Z'),
    },
  },
  {
    arrangementNumber: 1,
  }
);

var arr = [];

while (cursorx.hasNext()) {
  arr.push(cursorx.next());
}

print(arr.map(obj => obj.arrangementNumber));
