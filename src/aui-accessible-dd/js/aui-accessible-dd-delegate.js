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

    ATTRS: {
        tabIndex: {
            value: null
        }
    },

    EXTENDS: A.DD.Delegate,

    prototype: {
        activeNode: null,

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

            if (instance.get('tabIndex') !== null) {
                var nodes = container.all(instance.get('nodes'));

                nodes.each(
                    function(node){
                        node.set('tabIndex', index);
                    }
                , instance);
            }

            instance._bindKeypressEvent();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onFocus
        * @protected
        */
        _onFocusChange: function(event) {
            var instance = this;
            var target = event.target;
            var nodesClass = instance.get('nodes');

            instance.activeNode = target;
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _bindKeypressEvent
        * @protected
        */
        _bindKeypressEvent: function(node) {
            var instance = this;
            var container = A.one(instance.get(CONT));

            instance.once('drag:keyDown', A.bind(instance._defKeyDownFn, instance));
            instance.once('drag:start', A.bind(instance._onDragStart, instance));

            container.once('key', A.bind(instance._onCtrlKeydown, instance), 'down: 17');
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _defKeyDownFn
        * @protected
        */
        _defKeyDownFn: function(event) {
            var instance = this,
                doc = A.one(DOC),
                container = instance.get(CONT),
                ev = event.ev;

            ev.button = 1;
            ev.currentTarget = instance.activeNode;

            instance._delMouseDown(ev);

            doc.once('key', A.bind(instance._onCtrlKeyup, instance), 'up: 17');
            event.halt();
        },

        /**
         * Gets a list of valid drop targets for the drag object.
         *
         * @method _getDropTargets
         * @protected
         * @return {A.NodeList}
         */
        _getDropTargets: function() {
            var instance = this;
            var container = A.one(instance.get(CONT));

            return container.all('.' + DDM.CSS_PREFIX + '-drop');
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onCtrlKeydown
        * @protected
        */
        _onCtrlKeydown: function(event) {
            var instance = this;

            instance.fire('drag:keyDown', {ev: event});
            event.halt();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onCtrlKeyup
        * @protected
        */
        _onCtrlKeyup: function(event) {
            var instance = this;

            instance.fire('drag:mouseup');

            if (DDM.activeDrag) {
                DDM._end();
            }

            if (instance._handle) {
                instance._handle.detach();

                event.target.focus();
            }

            instance._bindKeypressEvent();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onDragStart
        * @protected
        */
        _onDragStart: function(event) {
            var instance = this,
                drag = event.target,
                doc = A.one(DOC),
                dragNode = drag.get('node');

            instance._targets = instance._getDropTargets();

            instance._currentTarget = instance._targets.indexOf(dragNode);

            instance._currentTarget = instance._currentTarget ? instance._currentTarget - 1 : instance._currentTarget;

            instance._handle = doc.on('key', A.bind(instance._setTarget, instance), 'down: 37, 39');

            event.halt();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _setTarget
        * @protected
        */
        _setTarget: function(event) {
            var instance = this,
                key = event.charCode;

            event.preventDefault();

            instance._prevTarget = instance._currentTarget;

            if (key === 37) {
                instance._currentTarget = instance._getPrevTarget();
            }
            else if (key === 39) {
                instance._currentTarget = instance._getNextTarget();
            }

            var prevDrop = instance._targets.item(instance._prevTarget),
                currentDrop = instance._targets.item(instance._currentTarget);

            instance._handleOut(prevDrop);
            instance._handleTargetOver(currentDrop);
        },

        /**
         * Sets the current drop target to the next available target in targets.
         *
         * @method _nextTarget
         * @protected
         */
        _getNextTarget: function() {
            var instance = this,
                currentTarget = instance._currentTarget + 1;

            return currentTarget < instance._targets.size() ? currentTarget : 0;
        },

        /**
         * Sets the current drop target to the previous target in targets.
         *
         * @method _prevTarget
         * @protected
         */
        _getPrevTarget: function() {
            var instance = this,
                currentTarget = instance._currentTarget - 1;

            return currentTarget >= 0 ? currentTarget : instance._targets.size() - 1;
        },

        /**
         * Handles previous drop target. Derives from _handleOut in dd-drop.js
         *
         * @method _handleOut
         * @protected
         */
        _handleOut: function(dropNode) {
            var drop = DDM.getDrop(dropNode);

            if (drop && drop.overTarget) {
                drop.overTarget = false;
                DDM._removeActiveShim(drop);
                dropNode.removeClass(DDM.CSS_PREFIX + '-drop-over');
                DDM.activeDrag.get('node').removeClass(DDM.CSS_PREFIX + '-drag-over');
                drop.fire('drop:exit', { drop: drop, drag: DDM.activeDrag });
                DDM.activeDrag.fire('drag:exit', { drop: drop, drag: DDM.activeDrag });
            }
        },

        /**
         * Handles current drop target. Derives from _handleTargetOver in dd-drop.js
         *
         * @method _handleTargetOver
         * @protected
         */
        _handleTargetOver: function(dropNode) {
            var instance = this;
            var drop = DDM.getDrop(dropNode);

            dropNode.addClass(DDM.CSS_PREFIX + '-drop-over');
            DDM.activeDrop = drop;
            drop.overTarget = true;

            drop.fire('drop:enter', { drop: drop, drag: DDM.activeDrag });
            drop.fire('drop:over', { drop: drop, drag: DDM.activeDrag });

            DDM.activeDrag.fire('drag:enter', { drop: drop, drag: DDM.activeDrag });
            DDM.activeDrag.fire('drag:over', { drop: drop, drag: DDM.activeDrag });

            DDM.activeDrag.get('node').addClass(DDM.CSS_PREFIX + '-drag-over');
        },
    }
});

A.DD.Delegate = A.mix(Delegate, A.DD.Delegate);
