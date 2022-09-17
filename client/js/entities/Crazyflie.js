/**
 * @file <client/js/entitites/Crazyflie.js>
 *
 * @author Guillaume Ricard - <guillaume.ricard@polymtl.ca>
 *
 * @project ARGoS3-Webviz <https://github.com/NESTLab/argos3-webviz>
 *
 * MIT License
 * Copyright (c) 2020 NEST Lab
 * Copyright (c) 2022 MIST Lab
 */

class Crazyflie {
  constructor(entity, scale, EntityLoadingFinishedFn) {
    this.scale = scale;
    this.entity = entity;

    var geometry =
      new THREE.BoxBufferGeometry(0.1 * scale, 0.1 * scale, 0.1 * scale);

    geometry.translate(0, 0, 2 * scale * 0.5);

    var material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,  // Blue color
    });

    var mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.setFromQuaternion(new THREE.Quaternion(
      entity.orientation.x,
      entity.orientation.y,
      entity.orientation.z,
      entity.orientation.w));

    mesh.position.x = entity.position.x * scale;
    mesh.position.y = entity.position.y * scale;
    mesh.position.z = entity.position.z * scale;

    this.mesh = mesh;

    EntityLoadingFinishedFn(this);
  }

  getMesh() {
    return this.mesh;
  }

  update(entity) {
    this.mesh.position.x = entity.position.x * this.scale;
    this.mesh.position.y = entity.position.y * this.scale;
    this.mesh.position.z = entity.position.z * this.scale;

    this.mesh.rotation.setFromQuaternion(new THREE.Quaternion(
      entity.orientation.x,
      entity.orientation.y,
      entity.orientation.z,
      entity.orientation.w));
  }
}
