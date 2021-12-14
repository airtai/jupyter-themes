// leave at least 2 line with only a star on it below, or doc generation fails
/**
 *
 *
 * Placeholder for custom user javascript
 * mainly to be overridden in profile/static/custom/custom.js
 * This will always be an empty file in IPython
 *
 * User could add any javascript in the `profile/static/custom/custom.js` file.
 * It will be executed by the ipython notebook at load time.
 *
 * Same thing with `profile/static/custom/custom.css` to inject custom css into the notebook.
 *
 *
 * The object available at load time depend on the version of IPython in use.
 * there is no guaranties of API stability.
 *
 * The example below explain the principle, and might not be valid.
 *
 * Instances are created after the loading of this file and might need to be accessed using events:
 *     define([
 *        'base/js/namespace',
 *        'base/js/events'
 *     ], function(IPython, events) {
 *         events.on("app_initialized.NotebookApp", function () {
 *             IPython.keyboard_manager....
 *         });
 *     });
 *
 * __Example 1:__
 *
 * Create a custom button in toolbar that execute `%qtconsole` in kernel
 * and hence open a qtconsole attached to the same kernel as the current notebook
 *
 *    define([
 *        'base/js/namespace',
 *        'base/js/events'
 *    ], function(IPython, events) {
 *        events.on('app_initialized.NotebookApp', function(){
 *            IPython.toolbar.add_buttons_group([
 *                {
 *                    'label'   : 'run qtconsole',
 *                    'icon'    : 'icon-terminal', // select your icon from http://fortawesome.github.io/Font-Awesome/icons
 *                    'callback': function () {
 *                        IPython.notebook.kernel.execute('%qtconsole')
 *                    }
 *                }
 *                // add more button here if needed.
 *                ]);
 *        });
 *    });
 *
 * __Example 2:__
 *
 * At the completion of the dashboard loading, load an unofficial javascript extension
 * that is installed in profile/static/custom/
 *
 *    define([
 *        'base/js/events'
 *    ], function(events) {
 *        events.on('app_initialized.DashboardApp', function(){
 *            require(['custom/unofficial_extension.js'])
 *        });
 *    });
 *
 * __Example 3:__
 *
 *  Use `jQuery.getScript(url [, success(script, textStatus, jqXHR)] );`
 *  to load custom script into the notebook.
 *
 *    // to load the metadata ui extension example.
 *    $.getScript('/static/notebook/js/celltoolbarpresets/example.js');
 *    // or
 *    // to load the metadata ui extension to control slideshow mode / reveal js for nbconvert
 *    $.getScript('/static/notebook/js/celltoolbarpresets/slideshow.js');
 *
 *
 * @module IPython
 * @namespace IPython
 * @class customjs
 * @static
 */

// Get less variables for terminal colors
var rules, rule, i, n, j, m, key;
var lessRules = [];
for (i = 0, n = document.styleSheets.length; i < n; i++) {
    rules = document.styleSheets[i].cssRules;
    for (j = 0, m = rules.length; j < m; j++) {
        rule = rules[j];
        try{
            if (rules[j].selectorText.indexOf('less-rule') !== -1) {
            key = /div.less-rule-(.*)/.exec(rules[j].selectorText)[1];
            lessRules[key] = rule.style['background-color'];
            }
        }
        catch(err){
            continue;
        }
    }
}

// set a global variable to enable/disable the custom fav icon switch
_enableCustomFavIcons = false

// set custom fav-icons on page load
requirejs([
    'jquery',
    'base/js/utils',
], function($, utils
    ){
    if (_enableCustomFavIcons) {
        favElement = document.getElementById('favicon');
        newFavPath = favElement.attributes.href.value.replace("/static/base/images/", "custom/fav-icons/")
        utils.change_favicon(newFavPath)
    }
    
});

// set timestamps on page load
requirejs([
    'jquery',
    'base/js/utils',
], function($, utils
    ){
    ts = (new Date()).toISOString().replaceAll("-", "").replaceAll(":", "")
    
    // setting timestamp for custom css
    customCss = document.querySelector("link[href='/custom/custom.css']").getAttribute("href") +"?v=" + ts
    document.querySelector("link[href='/custom/custom.css']").setAttribute("href", customCss)
        
});

// Create a MutationObserver to monitor the dynamic changes to the fav icon
requirejs([
    'base/js/promises',
    'base/js/utils'
], function(promises, utils) {
    if (_enableCustomFavIcons) {
        // Select the node that will be observed for mutations
        var targetNode = document.getElementsByTagName('head')[0];

        // Options for the observer (which mutations to observe)
        const config = { childList: true };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            for(const mutation of mutationsList) {
                    if ( (mutation.addedNodes.length) && (typeof(mutation.addedNodes) === 'object') ) {

                        mutation.addedNodes.forEach(function(_node) {
                            if ( (_node.id === 'favicon') && ( _node.href.includes('/static/base/images/') ) )  {
                                newFavPath = _node.attributes.href.value.replace("/static/base/images/", "custom/fav-icons/")
                                utils.change_favicon(newFavPath)
                            }
                        })
                    }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config); 
    }

});


if(typeof terminal !== 'undefined') {
    // Apply terminal theme
    terminal.term.setOption('theme', {
        foreground: lessRules['notebook-fg'],
        background: lessRules['notebook-bg'],
        black:         lessRules['ansiblack'],
        brightBlack:   lessRules['ansiblack'],
        red:           lessRules['ansired'],
        brightRed:     lessRules['ansired'],
        green:         lessRules['ansigreen'],
        brightGreen:   lessRules['ansigreen'],
        yellow:        lessRules['ansiyellow'],
        brightYellow:  lessRules['ansiyellow'],
        blue:          lessRules['ansiblue'],
        brightBlue:    lessRules['ansiblue'],
        magenta:       lessRules['ansimagenta'],
        brightMagenta: lessRules['ansimagenta'],
        cyan:          lessRules['ansicyan'],
        brightCyan:    lessRules['ansicyan'],
        white:         lessRules['ansiwhite'],
        brightWhite:   lessRules['ansiwhite'],
    });
}