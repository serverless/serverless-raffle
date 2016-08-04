
export function validateEmail(value) {
  const test = /^([\w_\.\-\+])+@([\w\-]+\.)+([\w]{2,10})+$/.test(value)
  return test
}

export function getErrorMsg (error) {
  switch (error) {
    case 'email':
      return "Oh no! invalid email address!";
    case 'password':
      return "Invalid Password.";
    case 'alreadyEntered':
      return 'This email address is already in the raffle';
    default:
      return null;
  }
}

function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className)
  } else {
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  }
}

export function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className)
  } else if (!hasClass(el, className)) {
    el.className += " " + className
  }
}

export function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className)
  } else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}