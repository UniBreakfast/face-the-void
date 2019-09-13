{
  const d = document, b = d.body, crEl = d.createElement.bind(d), 
        assign = Object.assign, p = 'px', min = Math.min;

  let zi = 1, lastTouch

  const dragInit = function({timeStamp: t}) {
    if (t - lastTouch < 300) return setTimeout( () =>
       b.onmousedown = evt => {drag(evt, this), b.onmousedown = null}, 0)
    lastTouch = t
    this.parentNode.style.zIndex = zi++
    this.classList.add('no-select', 'grabbed')
    b.onmousemove = b.ontouchmove = evt => drag(evt, this)
    b.onmouseup = b.ontouchend =()=> dragEnd(this)
  }

  const getActual = el => {
    var { left: x, top: y, width: w, height: h } = getComputedStyle(el),
        [ x, y, w, h ] = [x, y, w, h].map(val => parseInt(val))
    if (x!=x) x = (el.getBoundingClientRect().x + scrollX) | 0
    if (y!=y) y = (el.getBoundingClientRect().y + scrollY) | 0
    return {x, y, w, h}
  }

  const drag = ({ pageX: X, pageY: Y }, corner) => {
    const classes = corner.classList,
          el = corner.parentNode,
          style = el.style, subStyle = el.sub.style,
          { x, y, w, h } = getActual(el),
          upd = (top, left, width, height) => {
            Object.entries({top, left, width, height}).forEach(([k, v]) =>
              style[k] = subStyle[k] = v+p)
            localStorage[el.at] = 
              JSON.stringify({y: top, x: left, w: width, h: height})
          }
    classes.contains('nw')? upd(Y, X, w-X+x, h-Y+y) :
      classes.contains('ne')? upd(Y, min(X, x), X-x, h-Y+y) : 
        classes.contains('sw')? upd(min(Y, y), X, w-X+x, Y-y) :
          upd(min(Y, y), min(X, x), X-x, Y-y)
    el.sub.classList[[style.width, style.height]
      .some(val => parseInt(val) < 30)? 'add':'remove']('toosmall')
  }

  const dragEnd = function(el) {
    b.ontouchmove = b.ontouchend = b.onmousemove = b.onmouseup = null
    el.classList.remove('no-select', 'grabbed')
  }

  function evolve(el, { x, y, w, h }=getActual(el)) {
    el.sub = crEl('div')
    el.classList.add('box', 'out')

    const color = getComputedStyle(el).backgroundColor,
          style = el.sub.style

    for (child of el.childNodes) el.sub.append(child)
    el.appendChild(el.sub).className = 'sub in';
    
    ['nw', 'ne', 'sw', 'se'].forEach(side =>
      assign(el.appendChild(crEl('div')), {
        className: 'corner '+side,
        onmousedown: dragInit,
        ondragstart(evt) {evt.preventDefault()}
      }))

    assign(el.style, {left: x+p, top: y+p, borderColor: color})
    style.width = w+p, style.height = h+p
  }

  const at = ({x, y}) => `at_${x}_${y}_on_${innerWidth}x${innerHeight}`
  
  function evolveArr(arr) {
    arr.map(el => {
      var rect = getActual(el), old = localStorage[el.at = at(rect)]
      if (old) rect = JSON.parse(old)
      return [el, rect]
    }).forEach(box => evolve(...box))
  }

  onresize =()=> location.reload()

  fetch('faces.css').then(res => res.text()).then(css =>
    d.head.appendChild(crEl('style')).innerHTML = css)
}


