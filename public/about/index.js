import view from './view.html'
import css from './view.css'
import $ from 'jquery'

export default function () {
    $('#wrapper').html(view);
    let acc = document.getElementsByClassName("accordion");
    let i;
    
    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
          this.classList.toggle("active");
          var panel = this.nextElementSibling;
          if (panel.style.maxHeight){
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          } 
        }
      }
}