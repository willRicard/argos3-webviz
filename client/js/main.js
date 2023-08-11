/**
 * @file <client/js/main.js>
 * 
 * @author Prajankya Sonar - <prajankya@gmail.com>
 * 
 * @project ARGoS3-Webviz <https://github.com/NESTlab/argos3-webviz>
 * 
 * MIT License
 * Copyright (c) 2020 NEST Lab
 */

import jQuery from 'jquery';
import {w2layout, w2popup, w2ui} from 'w2ui';
import * as THREE from 'three';

import {onThreejsPanelResize} from './three_scene.js';
import helpModalBody from 'bundle-text:../html/help-modal.html';
import disconnectedModalBodyExport from 'bundle-text:../html/disconnected-modal.html';
import * as logs from './logs.js';

window.jQuery = jQuery;
window.$ = jQuery;

window.THREE = THREE;

export let disconnectedModalBody = disconnectedModalBodyExport;

/* Define function to run after all files are loaded */
var onAllFilesLoaded = function () {

  /* On Jquery load */
  $(function () {
    /* main panel-layout of the page */
    new w2layout({
      box: '#layout',
      name: 'app_layout',
      padding: 4,
      panels: [
        { type: 'top', size: 50, resizable: false },
        { type: 'left', size: "10%", resizable: true, content: 'left', hidden: true },
        { type: 'main', resizable: true, },
        { type: 'right', size: "30%", style: "background-color: #f2f2f2;border:0px", resizable: true, content: 'right' }
      ]
    });
    /* Log layout */
    new w2layout({
      box: '#layout_app_layout_panel_right', // make them nested
      name: 'log_layout',
      padding: 5,
      panels: [{
        type: 'top',
        size: "50%",
        resizable: true,
        title: "Log",
        style: "padding:4px 8px;margin-top:11px;background:white",
        html: '<div id="contentAreaLog" class="clusterize-content"></div>'
      }, {
        type: 'main',
        size: "50%",
        title: "LogErr",
        resizable: true,
        style: "padding:4px 8px;margin-top:11px;background:white",
        html: '<div id="contentAreaLogErr" class="clusterize-content"></div>'
      }]
    });

    /* On Threejs panel Resize */
    w2ui['app_layout'].on('resize', function (event) {
      /* When resizing is complete */
      event.onComplete = function () {
        if (window.threejs_panel) {
          onThreejsPanelResize();
        }
      }
    });

    /* Load main logic code sub-files - sequentially */
    /* load threejs scene */
    import("/js/three_scene.js").then(function({InitializeThreejs}) {
      /* Get the panel from layout */
      window.threejs_panel = $("#layout_app_layout_panel_main .w2ui-panel-content")

      /* Setup scene */
      InitializeThreejs(threejs_panel)
    });

    /* Load websockets and connect to server */
    import("/js/websockets.js").then(function({ConnectWebSockets}) {

      /* Add styling for log divs */
      $("#layout_log_layout_panel_top>div.w2ui-panel-content")
        .attr("id", "scrollAreaLog")
        .addClass("clusterize-scroll")

      $("#layout_log_layout_panel_main>div.w2ui-panel-content")
        .attr("id", "scrollAreaLogErr")
        .addClass("clusterize-scroll")

      /* Initialize Log objects */
      logs.init();

      /* Add button on top panel */
      $("#layout_app_layout_panel_top>div.w2ui-panel-content")
        .addClass('toolbar-flex-container')
        .append($("<div/>")
          .addClass('toolbar_counter')
          .attr("title", "Step counter")
          .prop("title", "Step counter")//for IE
          .html("{experiment.counter}")
        )
        /* Divider */
        .append($("<div/>")
          .addClass('toolbar_divider')
        )
        .append($("<div/>")
          .addClass('button')
          .addClass('wv-icon')
          .addClass('icon-step')
          .attr("title", "Step experiment")
          .prop("title", "Step experiment")//for IE
          .click(function () {
            window.wsp.sendPacked({ command: 'step' })
          })
        )
        .append($("<div/>")
          .addClass('button')
          .addClass('wv-icon')
          .addClass('icon-play')
          .attr('id', 'play_button')
          .attr("title", "Play experiment")
          .prop("title", "Play experiment")//for IE
          .click(function () {
            window.wsp.sendPacked({ command: 'play' })
          })
        )
        .append($("<div/>")
          .addClass('button')
          .addClass('wv-icon')
          .addClass('icon-pause')
          .attr('id', 'pause_button')
          .attr("title", "Pause experiment")
          .prop("title", "Pause experiment")//for IE
          .click(function () {
            window.wsp.sendPacked({ command: 'pause' })
          })
        )
        .append($("<div/>")
          .addClass('button')
          .addClass('wv-icon')
          .addClass('icon-ff')
          .attr('id', 'ff_button')
          .attr("title", "Fast forward experiment")
          .prop("title", "Fast forward experiment")//for IE
          .click(function () {
            var steps = parseInt($("#ff_steps_input").val());

            if (steps && steps >= 1 && steps <= 1000) {
              $("#ff_steps_input").val(steps)
              window.wsp.sendPacked({ command: 'fastforward', steps: steps })
            } else {
              window.wsp.sendPacked({ command: 'fastforward' })
            }
          })
        )
        .append($("<input/>")
          .attr('type', 'number')
          .attr('id', 'ff_steps_input')
          .attr('min', '1')
          .attr('max', '1000')
          .attr('value', '2')
          .attr("title", "Fast forward steps")
          .prop("title", "Fast forward steps")//for IE
        )
        /* Divider */
        .append($("<div/>")
          .addClass('toolbar_divider')
        )
        .append($("<div/>")
          .addClass('button')
          .attr('id', 'stop_button')
          .addClass('wv-icon')
          .addClass('icon-stop')
          .attr("title", "Terminate experiment")
          .prop("title", "Terminate experiment")//for IE
          .click(function () {
            window.wsp.sendPacked({ command: 'terminate' })
          })
        )
        .append($("<div/>")
          .addClass('button')
          .addClass('wv-icon')
          .addClass('icon-reset')
          .attr('id', 'reset_button')
          .attr("title", "Reset experiment")
          .prop("title", "Reset experiment")//for IE
          .click(function () {
            window.wsp.sendPacked({ command: 'reset' })
          })
        )
        /* Divider */
        .append($("<div/>")
          .addClass('toolbar_divider')
        )
        // .append($("<div/>")
        //   .addClass('button')
        //   .addClass('icon-settings')
        //   .attr('id', 'settings_button')
        //   .attr("title", "Settings")
        //   .prop("title", "Settings")//for IE
        //   .click(function () {
        //   })
        // )
        .append($("<div/>")
          .addClass('button')
          .addClass('wv-icon')
          .addClass('icon-help')
          .attr("title", "Help")
          .prop("title", "Help")//for IE
          .click(function () {
            w2popup.open({
              title: 'Help',
              body: helpModalBody,
              showClose: true,
              height: 330,
              width: 500
            })
            // window.wsp.sendPacked({ command: 'reset' })
          })
        )

        /* Spacer */
        .append($("<div/>").addClass('toolbar-spacer'))

        /* Right side of toolbar */
        .append($("<div/>")
          .addClass("toolbar_status")
          .html("{experiment.status}")
        )

      window.experiment = {}

      /* Bind data using rivets */
      rivets.bind($('#experiment'), { experiment: window.experiment })

      $("#preloader").fadeOut()
      ConnectWebSockets()
    });
  });
}

/* Load Jquery - sequentially */
loadJS("/node_modules/jquery-contextmenu/dist/jquery.contextMenu.min.js", true); /* Right click */

/* Load Websockets code */
loadJS("/js/libs/websocket-as-promised.js", true); /* basic websockets */
loadJS("/node_modules/robust-websocket/robust-websocket.js", true); /* auto Reconnect */

/* Load Three.js code */

loadJS("/node_modules/stats.js/build/stats.min.js", true);
loadJS("/js/libs/GLTFLoader.js", true);

/* Start running javascript after all files are loaded */
loadJS("/node_modules/rivets/dist/rivets.bundled.min.js", onAllFilesLoaded, true);
