/**
 * @file <client/js/entities/Cylinder.js>
 * 
 * @author Prajankya Sonar - <prajankya@gmail.com>
 * 
 * @project ARGoS3-Webviz <https://github.com/NESTlab/argos3-webviz>
 * 
 * MIT License
 * Copyright (c) 2020 NEST Lab
 */

class Cylinder {
    constructor(entity, scale, EntityLoadingFinishedFn) {
        this.scale = scale;
        this.entity = entity;

        var geometry = new THREE.CylinderGeometry(
            entity.radius * scale,
            entity.radius * scale,
            entity.height * scale,
            32
        );
        geometry.rotateX(-1.572);

        /* Bring to on top of zero*/
        geometry.translate(0, 0, entity.height * scale * 0.5);

        var color = null;
        if (entity.is_movable) {
            color = 0x00ff00;
        } else {
            color = 0x766e64
        }
        var material = new THREE.MeshPhongMaterial({
            color: color,
        });

        var cylinder = new THREE.Mesh(geometry, material);

        cylinder.rotation.setFromQuaternion(new THREE.Quaternion(
            entity.orientation.x,
            entity.orientation.y,
            entity.orientation.z,
            entity.orientation.w));

        cylinder.position.x = entity.position.x * scale;
        cylinder.position.y = entity.position.y * scale;
        cylinder.position.z = entity.position.z * scale;

        this.mesh = cylinder;

        EntityLoadingFinishedFn(this);
    }

    getMesh() {
        return this.mesh;
    }

    update(entity) {
        if (entity.is_movable) {
            try {
                this.mesh.position.x = entity.position.x * this.scale;
                this.mesh.position.y = entity.position.y * this.scale;

                this.mesh.rotation.setFromQuaternion(new THREE.Quaternion(
                    entity.orientation.x,
                    entity.orientation.y,
                    entity.orientation.z,
                    entity.orientation.w));
            } catch (ignored) { }
        }
    }
}