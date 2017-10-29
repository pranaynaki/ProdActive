const isMobile = window.navigator.userAgent.match(/Mobile/) && window.navigator.userAgent.match(/Mobile/)[0] === "Mobile";
const event = isMobile ? "touchstart" : "click";

const button = document.querySelectorAll('*[data-animation="ripple"]'),
            container = document.querySelector(".container");

for (var i = 0; i < button.length; i++) {
    const currentBtn = button[i];
    
    currentBtn.addEventListener(event, function(e) {
        
        e.preventDefault();
        const button = e.target,
                    rect = button.getBoundingClientRect(),
                    originalBtn = this,
                    btnHeight = rect.height,
                    btnWidth = rect.width;
        let posMouseX = 0,
                posMouseY = 0;
        
        if (isMobile) {
            posMouseX = e.changedTouches[0].pageX - rect.left;
            posMouseY = e.changedTouches[0].pageY - rect.top;
        } else {
            posMouseX = e.x - rect.left;
            posMouseY = e.y - rect.top;
        }
        
        const baseCSS =  `position: absolute;
                                            width: ${btnWidth * 2}px;
                                            height: ${btnWidth * 2}px;
                                            transition: all linear 700ms;
                                            transition-timing-function:cubic-bezier(0.250, 0.460, 0.450, 0.940);
                                            border-radius: 50%;
                                            background: var(--color-ripple);
                                            top:${posMouseY - btnWidth}px;
                                            left:${posMouseX - btnWidth}px;
                                            pointer-events: none;
                                            transform:scale(0)`
        
        var rippleEffect = document.createElement("span");
        rippleEffect.style.cssText = baseCSS;
        
        //prepare the dom
        currentBtn.style.overflow = "hidden";
        this.appendChild(rippleEffect);
        
        //start animation
        setTimeout( function() { 
            rippleEffect.style.cssText = baseCSS + `transform:scale(1); opacity: 0;`;
        }, 5);
        
        setTimeout( function() {
            rippleEffect.remove();
            //window.location.href = currentBtn.href;
        },700);
    })
}

var actualContent = "{{description}}";

$(document).ready(function () {
    $(document).on('mouseenter', '.button1', function () {
        document.getElementById("text-container").innerHTML = "{{ button1text }}";
        console.log("button1hover");
    }).on('mouseleave', '.button1', function () {
        document.getElementById("text-container").innerHTML = actualContent;
    });
    $(document).on('mouseenter', '.button2', function () {
        document.getElementById("text-container").innerHTML = "{{ button2text }}";
    }).on('mouseleave', '.button1', function () {
        document.getElementById("text-container").innerHTML = actualContent;
    });
    $(document).on('mouseenter', '.button3', function () {
        document.getElementById("text-container").innerHTML = "{{ button3text }}";
    }).on('mouseleave', '.button1', function () {
        document.getElementById("text-container").innerHTML = actualContent;
    });
    $(document).on('click', '.button1', function () {
        actualContent = "{{ button1text }}";
        document.getElementById("text-container").innerHTML = actualContent;
    });
    $(document).on('click', '.button2', function () {
        actualContent = "{{ button2text }}";
        document.getElementById("text-container").innerHTML = actualContent;
    });
    $(document).on('click', '.button3', function () {
        actualContent = "{{ button3text }}";
        document.getElementById("text-container").innerHTML = actualContent;
    });
});
