export function moveInArray<E>(arr: E[], from: number, to: number) {
  if( from == to ) return;
  if( from >= arr.length || to >= arr.length || from < 0 || to < 0) {
    return;
  }
  var e = arr[from];
  if(from < to) {
    for(var i = from; i < to; i++) {
      arr[i] = arr[i+1]
    }
  } else {
    for(var i = from; i > to; i--) {
      arr[i] = arr[i-1];
    }
  }
  arr[to] = e;
}