/**
 * The Accessible DD Delegate Component
 *
 * @module aui-accessible-dd-delegate
 */

var CONT = 'container',
    DOC = A.config.doc,
    DDM = A.DD.DDM;

var Delegate = A.Component.create({

    NAME: A.DD.Delegate.NAME,

    ATTRS: {},

    EXTENDS: A.DD.Delegate,

    prototype: {
        activeNode: null,
        mouseAtTop: false,

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method initializer
        * @protected
        */
        initializer: function() {
            var instance = this,
                container = A.one(instance.get(CONT)),
                index = instance.get('tabIndex');

            instance._handles.push(A.on('focus', A.bind(instance._onMouseEnter, instance), container));
            instance._handles.push(A.on('focus', A.bind(instance._onFocusChange, instance), container));
            instance._handles.push(A.on('blur', A.bind(instance._onMouseLeave, instance), container));
            instance._handles.push(
                instance.dd.on('setTarget', function(event) {
                    if (DDM.activeDrag) {
                        instance._simulateMouseXY(DDM.activeDrag);
                    }
                })
            );

            instance.once('drag:keyDown', instance._onCtrlKeydown, instance);

            container.on('key', A.bind(instance._onCtrlKeyup, instance), 'up:17');

            instance._plugNodeFocusManager();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onFocus
        * @protected
        */
        _onFocusChange: function(event) {
            var instance = this;

            instance.dd.detachAll('drag:keyDown');
            instance.dd.detachAll('drag:start');

            node = event.target;

            instance.dd.set('node', node);

            instance.dd._bindKeyEvents();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onCtrlKeydown
        * @protected
        */
        _onCtrlKeydown: function(event) {
            var instance = this;

            instance._unplugNodeFocusManager();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onCtrlKeyup
        * @protected
        */
        _onCtrlKeyup: function(event) {
            var instance = this;

            instance.once('drag:keyDown', instance._onCtrlKeydown, instance);

            instance._plugNodeFocusManager();

            event.target.blur().focus();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _plugNodeFocusManager
        * @protected
        */
        _plugNodeFocusManager: function() {
            var instance = this,
                container = A.one(instance.get(CONT));

            container.plug(
                A.Plugin.NodeFocusManager, {
                    descendants: instance.get('nodes'),
                    keys: { next: 'down:39', previous: 'down:37' }
                }
            );
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _simulateMouseXY
        * @protected
        */
        _simulateMouseXY: function(drag) {
            if (drag) {
                var nodeXY = drag.nodeXY,
                    node = drag.get('dragNode'),
                    win = A.getWin();

                if (!this.mouseAtTop) {
                    nodeXY[0] = win.width();
                    nodeXY[1] = win.height();
                }
                else {
                    nodeXY[0] = 0;
                    nodeXY[1] = 0;
                }

                drag.mouseXY = nodeXY;
                this.mouseAtTop = !this.mouseAtTop;
            }
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _unplugNodeFocusManager
        * @protected
        */
        _unplugNodeFocusManager: function() {
            var instance = this,
                container = A.one(instance.get(CONT));

            container.unplug(A.Plugin.NodeFocusManager);
        },
    }
});

A.DD.Delegate = A.mix(Delegate, A.DD.Delegate);
