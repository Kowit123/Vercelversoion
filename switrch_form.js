    function switchForm2(event) {
        if (event) {
            event.preventDefault();
        }
        document.getElementById("container").classList.add('n_display');
        document.getElementById("h").classList.add('n_display');
        document.getElementById("container2").classList.remove('n_display');  
        document.getElementById("h1").classList.remove('n_display'); 
        document.getElementById("bttd1").classList.remove('n_display'); 
        document.getElementById("bttd").classList.add('n_display');     
    }

        function switchForm(event) {
        if (event) {
            event.preventDefault();
        }
        document.getElementById("container").classList.remove('n_display');
        document.getElementById("h").classList.remove('n_display');
        document.getElementById("container2").classList.add('n_display');
        document.getElementById("h1").classList.add('n_display');
        document.getElementById("bttd").classList.remove('n_display');
        document.getElementById("bttd1").classList.add('n_display');

    }
