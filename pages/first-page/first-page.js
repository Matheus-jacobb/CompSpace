
// go to second page and make animations
function playGame(){
  var spaceship = document.getElementById('spaceship');
  var title = document.getElementById('welcome')

  spaceship.animate([
    {transform: 'rotate(90deg) translateY(-0vw)'},
    {transform: 'rotate(90deg) translateY(-5vw)'},
    {transform: 'rotate(90deg) translateY(-10vw)'},
    {transform: 'rotate(90deg) translateY(-25vw)'},
    {transform: 'rotate(90deg) translateY(-50vw)'},
    {transform: 'rotate(90deg) translateY(-100vw)'}
  ],1500)

  title.animate([
    {opacity: '1'},
    {opacity: '0'},
  ],1500);

  setTimeout(()=>window.location.href = "../second-page/second-page.html",1200)
}