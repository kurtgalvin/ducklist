const escape = function(string){
  var text = document.createTextNode(string);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

const displayDate = function(dateString) {
  const date = new Date(dateString);
  // Milliseconds Passed
  const msPassed = new Date() - date;
  const minPassed = msPassed / (1000 * 60);
  if (minPassed === 0) {
    return 'Just now'
  }
  if (minPassed < 60) {
    return `${Math.round(minPassed)} min ago`;
  }
  const hoursPassed = minPassed / 60;
  if (hoursPassed < 24) {
    return `${Math.round(hoursPassed)} hours ago`
  }
  const daysPassed = Math.round(hoursPassed / 24);
  if (daysPassed === 1) {
    return 'Yesterday'
  } else {
    return `${daysPassed} days ago`
  }
}

const getRoomFromMessage = function({ re_item, owner_id, user_id, other_user }) {
  let room = `${re_item}-${owner_id}`
  if (owner_id === user_id) {
    room += `-${other_user}`
  } else {
    room += `-${user_id}`
  }
  return room
}
