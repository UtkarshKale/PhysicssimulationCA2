
const desktop = document.querySelector('.desktop');


function toggleFolder(folderId) {
  const folder = document.getElementById(folderId);
  folder.classList.toggle('hidden');
}

function openWindow(app) {
  
  const windowEl = document.createElement('div');
  windowEl.className = 'window';
  windowEl.innerHTML = `
    <div class="window-header">
      <span>${app.replace(/([A-Z])/g, ' $1')}</span>
      <button class="close-btn" onclick="closeWindow(this)">X</button>
    </div>
    <div class="window-body">
      ${
        app === 'notes'
          ? '<textarea style="width:100%; height:100%;"></textarea>'
          : app === 'pendulumLab'
          ? '<iframe src="https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html" style="width:100%; height:100%; border:none;"></iframe>'
          : app === 'singleSpring'
          ? '<iframe src="https://www.myphysicslab.com/springs/single-spring-en.html" style="width:100%; height:100%; border:none;"></iframe>'
          : app === 'mutualAttraction'
          ? '<iframe src="https://www.myphysicslab.com/engine2D/mutual-attract-en.html" style="width:100%; height:100%; border:none;"></iframe>'
          : app === 'magnetsElectromagnets'
          ? '<iframe src="https://phet.colorado.edu/sims/html/magnets-and-electromagnets/latest/magnets-and-electromagnets_all.html" style="width:100%; height:100%; border:none;"></iframe>'
          : app === 'chargesField'
          ? '<iframe src="https://phet.colorado.edu/sims/html/charges-and-fields/latest/charges-and-fields_all.html" style="width:100%; height:100%; border:none;"></iframe>'
          : app === 'geometricOptics'
          ? '<iframe src="https://phet.colorado.edu/sims/html/geometric-optics-basics/latest/geometric-optics-basics_all.html" style="width:100%; height:100%; border:none;"></iframe>'
          : app === 'bendingLight'
          ? '<iframe src="https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_all.html" style="width:100%; height:100%; border:none;"></iframe>'
          : app === 'soundWave'
          ? '<iframe src="https://phet.colorado.edu/sims/html/sound-waves/latest/sound-waves_all.html" style="width:100%; height:100%; border:none;"></iframe>'
          : app === 'blackbodySpectrum'
          ? '<iframe src="https://phet.colorado.edu/sims/html/blackbody-spectrum/latest/blackbody-spectrum_all.html" style="width:100%; height:100%; border:none;"></iframe>'
          : '<iframe src="https://phet.colorado.edu/sims/html/rutherford-scattering/latest/rutherford-scattering_all.html" style="width:100%; height:100%; border:none;"></iframe>'
      }
    </div>
  `;
  desktop.appendChild(windowEl);

  dragElement(windowEl);
 
  makeDraggable(windowEl);
}


    function closeWindow(button) {
      button.closest('.window').remove();
    }

    function dragElement(element) {
      const header = element.querySelector('.window-header');
      let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

      header.onmousedown = (e) => {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmousemove = drag;
        document.onmouseup = stopDrag;
      };

      function drag(e) {
        e.preventDefault();
        offsetX = mouseX - e.clientX;
        offsetY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        element.style.top = `${element.offsetTop - offsetY}px`;
        element.style.left = `${element.offsetLeft - offsetX}px`;
      }

      function stopDrag() {
        document.onmousemove = null;
        document.onmouseup = null;
      }




      
    }
  