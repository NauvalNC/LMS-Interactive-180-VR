////////////// Course Section - START //////////////

var score = 0;

//Start Course Component
AFRAME.registerComponent('click-start-course', 
{
    init:function() 
    {
        var videoSphere = document.querySelector('a-videosphere');
        videoSphere.components.material.material.map.image.currentTime = 1;

        var initializer = this.el;

        this.el.addEventListener('click', function(e) 
        {
            startCourse();

            initializer.emit('fadeout');

            setTimeout(function() 
            {
                destroyElement(initializer);
            }, 500);
        });
    }
});

//Start Course Function
function startCourse() 
{
    playSkyVideo();

    try 
    {
        LMSInitialize();
    }
    catch(err) 
    {
        console.error("Can't initialize LMS");
    }

    score = 0;
}

//Add score to LMS
function addScore(value) 
{
    score += value;
}

//Set score and commit it to LMS
function commitScore() 
{
    try 
    {
        LMSSetValue("cmi.core.score.min", 0);
        LMSSetValue("cmi.core.score.max", 100);
        LMSSetValue("cmi.core.score.raw", score);
        LMSCommit();
    }
    catch(err) 
    {
        console.error("Can't set score to LMS");
    }
}

//End course
function finishCourse(callback) 
{
    fadeOutVideoSky();
    
    if (callback != null) 
    {
        setTimeout(function()
        {
            commitScore();
    
            try 
            {
                LMSFinish();
            } catch(err) 
            {
                console.error("Can't finish LMS");
            }
            
            callback();
        }, 1000);
    }
}

////////////// Course Section - END //////////////


////////////// System Section - START //////////////

//Make fade in animation on init
AFRAME.registerComponent('fade-in',
{
    init: function()
    {
        this.el.setAttribute('animation__fadein', 'startEvents: fadein; property: material.opacity; from: 0; to: 1; dur: 200;');
        this.el.setAttribute('animation__textfadein', 'startEvents: fadein; property: text.opacity; from: 0; to: 1; dur: 200;');
        this.el.emit('fadein');
    }
});

//Add fade out animation on init
AFRAME.registerComponent('fade-out',
{
    init: function()
    {
        this.el.setAttribute('animation__fadeout', 'startEvents: fadeout; property: material.opacity; from: 1; to: 0; dur: 200;');
        this.el.setAttribute('animation__textfadeout', 'startEvents: fadeout; property: text.opacity; from: 1; to: 0; dur: 200;');
    }
});

//Assign Onlick Listener

//Destroy Element
function destroyElement(element) 
{
    element.parentNode.removeChild(element);
}

////////////// System Section - END //////////////


////////////// Sky Image Section - START //////////////

//Set Sky Image Component
//Parameters {source}
AFRAME.registerComponent('click-set-imagesky', 
{
    schema: {
        source: {type: 'string'}
    },

    init: function() 
    {
        var source = this.data.source;
        this.el.addEventListener('click', function(e) 
        {
            setSkyImage(source);
        });
    }
});

//Set Sky Image Function
function setSkyImage(source) 
{
    var sky = document.querySelector('a-sky');

    sky.emit('fadeout');

    setTimeout(function() 
    {
        sky.setAttribute('src', source);
    }, 1000);

    setTimeout(function() 
    {
        sky.emit('fadein');
    }, 1000);
}

////////////// Sky Image Section - END //////////////


////////////// Sky Video Section - START //////////////

//Play sky video
function playSkyVideo() 
{
    var videoSphere = document.querySelector('a-videosphere');
    videoSphere.components.material.material.map.image.play();
}

//Pause sky video
function pauseSkyVideo() 
{
    var videoSphere = document.querySelector('a-videosphere');
    videoSphere.components.material.material.map.image.pause();
}

//Create Sky Video Timeout Request Component
//Parameters {timeout, method}
AFRAME.registerComponent('click-skyvideo-timeout-request', 
{
    schema: 
    {
        timeout: {type: 'number'},
        method: {type: 'string'}
    },

    multiple: true,

    init:function()
    {
        var scene = this.el.sceneEl;
        var wait = this.data.timeout;
        var func = this.data.method;

        this.el.addEventListener('click', function(e) 
        {
            skyVideoTimeOutRequest(scene, wait, func);
        });
    }
});

//Sky Video Timeout Request Function
function skyVideoTimeOutRequest(scene, timeout, method) 
{
    var listener = scene.querySelector("#skyvideo-timeout-listener");

    var req = document.createElement('a-entity');
    req.setAttribute('skyvideo-listen-timeout-request', 'timeout: ' + timeout);
    req.setAttribute('skyvideo-listen-timeout-request', 'method: ' + method);
    listener.appendChild(req);
}

//Video Timeout Listener Component
//Parameters {timeout, method}
AFRAME.registerComponent('skyvideo-listen-timeout-request', 
{
    schema:
    {
        timeout: {type: 'number'},
        method: {type: 'string'}
    },

    init:function()
    {
        var videoSphere = document.querySelector('a-videosphere');
        this.entities = videoSphere.components.material.material.map.image;
    },

    tick:function() 
    {
        if (this.entities.currentTime >= this.data.timeout) 
        {
            //Calling the passed method
            var func = window[this.data.method];
            func();

            this.el.parentNode.removeChild(this.el);
        }
    }
});

//Set Video Sky Component
//Parameters {source}
AFRAME.registerComponent('click-set-videosky', 
{
    schema: {
        source: {type: 'string'},
        autoplay: {type: 'boolean'}
    },

    init: function() 
    {
        var source = this.data.source;
        var autoplay = this.data.autoplay;

        this.el.addEventListener('click', function(e) 
        {
            setVideoSky(source, autoplay);
        });
    }
});

//Set Video Sky Function
function setVideoSky(source, autoplay) 
{
    var videoSphere = document.querySelector('a-videosphere');

    videoSphere.emit('fadeout');

    setTimeout(function() 
    {
        videoSphere.setAttribute('material', 'src: ' + source + ';');
        videoSphere.components.material.material.map.image.currentTime = 1;

        if (autoplay == true) 
        {
            playSkyVideo();
        }
    }, 1000);

    setTimeout(function() 
    {
        videoSphere.emit('fadein');
    }, 1000);
}

function fadeOutVideoSky() 
{
    var videoSphere = document.querySelector('a-videosphere');
    videoSphere.emit('fadeout');
}

////////////// Sky Video Section - END //////////////


////////////// Timeout Section - START //////////////

//Set Timeour Function Request
//Parameters {timeout -> Milliseconds)}
function timeoutFunctionRequest(timeout, func)
{
    setTimeout(function() 
    {
        func();
    }, timeout);
}

////////////// Timeout Section - END //////////////


////////////// Text Panel Section - START //////////////

//Create Question Panel
//Parameters {scene, parent, question}
function initQuestion(scene, parent, question) 
{
    var qsPanel = scene.querySelector(parent);

    var el = document.createElement('a-entity');

    el.setAttribute('text', 'value: ' + question);
    el.setAttribute('mixin', 'question-text');

    qsPanel.appendChild(el);

    return el;
}

//Clear Question Panel
//Parameters {question -> to be removed}
function clearQuestion(question) 
{
    question.emit('fadeout');

    setTimeout(function() 
    {
        destroyElement(question);
    }, 200);
}

//Create Option Panel
//Parameters {scene, parent, options, callback -> When option is submitted}
//Options is an array that consist of {text, method}
function initOptions(scene, parent, options, callback) 
{
    var opPanel = scene.querySelector(parent);
    var offset = 0.18;

    var els = [];

    var yPos = 0;
    var i;
    for (i = 0; i < options.length; i++) 
    {
        var el = document.createElement('a-entity');
        
        el.setAttribute('text', 'value: ' + options[i].text);
        el.setAttribute('mixin', 'text-panel');
        el.setAttribute('class', 'interactable');

        if (options[i].method !== null) 
        {
            el.addEventListener('click', options[i].method);
        }

        if (callback != null) 
        {
            el.addEventListener('click', callback);
        }

        els.push(el);
        
        el.addEventListener('click', function() { clearOptions(els); });

        opPanel.appendChild(el);

        el.object3D.position.y = yPos;
        
        yPos -= offset;
    }

    return els;
}

//Clear Options Panel
//Parameters {options -> to be removed}
function clearOptions(options) 
{
    var i;
    for (i = 0; i < options.length; i++) 
    {
        options[i].emit('fadeout');
    }

    var parent = options[0].parentNode;

    setTimeout(function() 
    {
        var children = parent.querySelectorAll('a-entity');
        for (var j = 0; j < children.length; j++) 
        {
            parent.removeChild(children[j]);
        }
    }, 200);
}

////////////// Text Panel Section - END //////////////