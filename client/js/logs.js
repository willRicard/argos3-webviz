/**
 * @file <client/js/logs.js>
 *
 * @author Guillaume Ricard <guillaume.ricard@polymtl.ca>
 *
 * @project ARGoS3-Webviz <https://github.com/NESTLab/argos3-webviz>
 *
 * MIT License
 * Copyright (c) 2023 MIST Lab
 */
import Clusterize from 'clusterize.js';

let log_clusterize = null;
let logerr_clusterize = null;

/**
 * Initialize Log objects.
 */
export function init() {
  log_clusterize = new Clusterize({
    show_no_data_row: false,
    scrollId: 'scrollAreaLog',
    contentId: 'contentAreaLog',
  });
  logerr_clusterize = new Clusterize({
    show_no_data_row: false,
    scrollId: 'scrollAreaLogErr',
    contentId: 'contentAreaLogErr',
  });
}

/**
 * Display log message.
 *
 * @param {string} message Log message
 */
export function prepend(message) {
  log_clusterize.prepend(message);
}

/**
 * Display error log message.
 *
 * @param {string} message Log message
 */
export function prependErr(message) {
  logerr_clusterize.prepend(message);
}

/**
 * Clear standard and error logs.
 */
export function clear() {
  log_clusterize.clear();
  logerr_clusterize.clear();
}
