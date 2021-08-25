var _pj;
var lodash = require('lodash');
function _pj_snippets(container) {
    function in_es6(left, right) {
        if (((right instanceof Array) || ((typeof right) === "string"))) {
            return (right.indexOf(left) > (- 1));
        } else {
            if (((right instanceof Map) || (right instanceof Set) || (right instanceof WeakMap) || (right instanceof WeakSet))) {
                return right.has(left);
            } else {
                return (left in right);
            }
        }
    }
    container["in_es6"] = in_es6;
    return container;
}
_pj = {};
_pj_snippets(_pj);
function next_valid_coord(data, frame) {
    var n_frame, sum_frame;
    n_frame = 0;
    for (var frame_data, _pj_c = 0, _pj_a = data, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
        frame_data = _pj_a[_pj_c];
        if ((n_frame < frame)) {
            continue;
        }
        sum_frame = 0;
        for (var coord, _pj_f = 0, _pj_d = frame_data, _pj_e = _pj_d.length; (_pj_f < _pj_e); _pj_f += 1) {
            coord = _pj_d[_pj_f];
            sum_frame += lodash.sum(coord);
        }
        if ((sum_frame !== 0)) {
            return n_frame;
        }
        n_frame += 1;
    }
    return frame
}
function last_valid_coord(data, frame) {
    var last_coord, n_frame, sum_frame;
    last_coord = 0;
    n_frame = 0;
    for (var frame_data = 0, _pj_a = data.length; (frame_data < _pj_a); frame_data += 1) {
        if ((n_frame > frame)) {
            break;
        }
        sum_frame = 0;
        for (var coord, _pj_d = 0, _pj_b = frame_data, _pj_c = _pj_b.length; (_pj_d < _pj_c); _pj_d += 1) {
            coord = _pj_b[_pj_d];
            sum_frame += lodash.sum(coord);
        }
        if ((sum_frame !== 0)) {
            return n_frame;
        }
        n_frame += 1;
    }

    return frame;
}
function interpolate_keypoints(list_data) {
    var  keypoints_data, keypoints_list, last_contrib, last_valid, n, n_frame, next_contrib, next_valid, part, sum_coord, x, y, z;
    keypoints_list = [];
    for (var i = 0, _pj_a = list_data.length; (i < _pj_a); i += 1) {
        keypoints_data = [];
        n_frame = 0;
        for (var frame_data, _pj_d = 0, _pj_b = list_data[i], _pj_c = _pj_b.length; (_pj_d < _pj_c); _pj_d += 1) {
            frame_data = _pj_b[_pj_d];
            part = [];
            sum_coord = 0;
            n = 0;
            for (var coord, _pj_g = 0, _pj_e = frame_data, _pj_f = _pj_e.length; (_pj_g < _pj_f); _pj_g += 1) {
                coord = _pj_e[_pj_g];
                if (coord === undefined) {
                                x = 0;
                                y = 0;
                                z = 0;
                            }

                else {
                    x = coord[0];
                    y = coord[1];
                    z = coord[2];
                }
                part.push([x, y, z]);
                sum_coord += lodash.sum(coord);
                n += 1;
            }
            if ((sum_coord === 0)) {
                part = [];
                last_valid = last_valid_coord(list_data[i], n_frame);
                next_valid = next_valid_coord(list_data[i], n_frame);
                if ((next_valid && last_valid)) {
                    last_contrib = ((n_frame - last_valid) / (next_valid - last_valid));
                    next_contrib = ((next_valid - n_frame) / (next_valid - last_valid));
                    n = 0;
                    for (var coord, _pj_g = 0, _pj_e = frame_data, _pj_f = _pj_e.length; (_pj_g < _pj_f); _pj_g += 1) {
                        coord = _pj_e[_pj_g];
                        if (coord === undefined) {
                                x = 0;
                                y = 0;
                                z = 0;
                            }
                        else
                        {
                            x = ((list_data[i][last_valid][n][0] * next_contrib) + (list_data[i][next_valid][n][0] * last_contrib));
                            y = ((list_data[i][last_valid][n][1] * next_contrib) + (list_data[i][next_valid][n][1] * last_contrib));
                            z = ((list_data[i][last_valid][n][2] * next_contrib) + (list_data[i][next_valid][n][2] * last_contrib));
                        }
                        part.push([x, y, z]);
                        n += 1;
                    }
                } else {
                    if (next_valid) {
                        n = 0;
                        for (var coord, _pj_g = 0, _pj_e = frame_data, _pj_f = _pj_e.length; (_pj_g < _pj_f); _pj_g += 1) {
                            coord = _pj_e[_pj_g];
                            if (coord === undefined) {
                                x = 0;
                                y = 0;
                                z = 0;
                            }
                            else {
                                x = list_data[i][next_valid][n][0];
                                y = list_data[i][next_valid][n][1];
                                z = list_data[i][next_valid][n][2];
                            }
                            part.push([x, y, z]);
                            n += 1;
                        }
                    } else {
                        n = 0;
                        for (var coord, _pj_g = 0, _pj_e = frame_data, _pj_f = _pj_e.length; (_pj_g < _pj_f); _pj_g += 1) {
                            coord = _pj_e[_pj_g];
                            if (coord === undefined) {
                                x = 0;
                                y = 0;
                                z = 0;
                            }
                            else {
                                x = list_data[i][last_valid][n][0];
                                y = list_data[i][last_valid][n][1];
                                z = list_data[i][last_valid][n][2];
                            }
                            part.push([x, y, z]);
                            n += 1;
                        }
                    }
                }
            }
            keypoints_data.push(part);
            n_frame += 1;
        }
        keypoints_list.push(keypoints_data);

    }
    return keypoints_list;
}
function put_hand_in_body(pose_data, hand_left_data, hand_right_data) {

    var l_disp, part_l, part_r, r_disp;
    for (var frame = 0, _pj_a = hand_left_data.length; (frame < _pj_a); frame += 1) {
        part_r = [];
        part_l = [];
        l_disp = [(hand_left_data[frame][0][0] - pose_data[frame][15][0]), (hand_left_data[frame][0][1] - pose_data[frame][15][1]), (hand_left_data[frame][0][2] - pose_data[frame][15][2])];
        r_disp = [(hand_right_data[frame][0][0] - pose_data[frame][16][0]), (hand_right_data[frame][0][1] - pose_data[frame][16][1]), (hand_right_data[frame][0][2] - pose_data[frame][16][2])];

        for (var joint = 0, _pj_b = hand_left_data[frame].length; (joint < _pj_b); joint += 1) {
            hand_left_data[frame][joint] = [(hand_left_data[frame][joint][0] - l_disp[0]), (hand_left_data[frame][joint][1] - l_disp[1]), (hand_left_data[frame][joint][2] - l_disp[2])];
            hand_right_data[frame][joint] = [(hand_right_data[frame][joint][0] - r_disp[0]), (hand_right_data[frame][joint][1] - r_disp[1]), (hand_right_data[frame][joint][2] - r_disp[2])];
            if (isNaN(hand_left_data[frame][joint][0]))
            {
                hand_left_data[frame][joint] = [0.0,0.0,0.0];
            }
            if (isNaN(hand_right_data[frame][joint][0]))
            {
                hand_right_data[frame][joint] = [0.0,0.0,0.0];
            }
        }
    }
    return [pose_data, hand_left_data, hand_right_data];
}
function mediapipe_to_posenet(pose) {
    var framenet, list_poses_to_mantain, n;
    list_poses_to_mantain = [0, 2, 5, 7, 8, 11, 12, 13, 14, 15, 16, 23, 24];
    let posenet = []

    for (var frame, _pj_c = 0, _pj_a = pose, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
        frame = _pj_a[_pj_c];
        framenet = [];
        n = 0;
        for (var bone, _pj_f = 0, _pj_d = frame, _pj_e = _pj_d.length; (_pj_f < _pj_e); _pj_f += 1) {
            bone = _pj_d[_pj_f];
            if (_pj.in_es6(n, list_poses_to_mantain)) {
                framenet.push(bone);
            }
            n += 1;
        }
        framenet.push(frame[23]);
        framenet.push(frame[24]);
        framenet.push(frame[23]);
        framenet.push(frame[24]);
        posenet.push(framenet);

    }
    if (posenet === undefined)
    {
        for (var frame, _pj_c = 0, _pj_a = pose, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
        let key_aux = []
        for (let i = 0; i < 17; i++) {
            key_aux.push([0.0,0.0,0.0])
          }
      posenet.push(key_aux)
    }
    }
    return posenet;
}
function chicken_neck_mediapipe(pose, lhand, rhand) {
    var disp, n;
    n = 0;
    for (var frame, _pj_c = 0, _pj_a = pose, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
        frame = _pj_a[_pj_c];
        disp = [0, 0, 0];
        disp[0] = (disp[0] - ((frame[5][0] + frame[6][0]) * 0.5));
        disp[1] = (disp[1] - ((frame[5][1] + frame[6][1]) * 0.5));
        disp[2] = (disp[2] - ((frame[5][2] + frame[6][2]) * 0.5));
        for (var i = 0, _pj_d = pose[n].length; (i < _pj_d); i += 1) {
            pose[n][i][0] = (pose[n][i][0] + disp[0]);
            pose[n][i][1] = ((pose[n][i][1] + disp[1]) - 1);
            pose[n][i][2] = (pose[n][i][2] + disp[2]);
        }
        for (var i = 0, _pj_d = lhand[n].length; (i < _pj_d); i += 1) {
            lhand[n][i][0] = (lhand[n][i][0] + disp[0]);
            lhand[n][i][1] = ((lhand[n][i][1] + disp[1]) - 1);
            lhand[n][i][2] = (lhand[n][i][2] + disp[2]);
        }
        for (var i = 0, _pj_d = rhand[n].length; (i < _pj_d); i += 1) {
            rhand[n][i][0] = (rhand[n][i][0] + disp[0]);
            rhand[n][i][1] = ((rhand[n][i][1] + disp[1]) - 1);
            rhand[n][i][2] = (rhand[n][i][2] + disp[2]);
        }
        n += 1;
    }
    return [pose, lhand, rhand];
}

export function treat_keypoints_func(pose_keypoints_data, hand_left_keypoints_data, hand_right_keypoints_data) {
    [pose_keypoints_data, hand_left_keypoints_data, hand_right_keypoints_data] = interpolate_keypoints([pose_keypoints_data, hand_left_keypoints_data, hand_right_keypoints_data]);
    [pose_keypoints_data, hand_left_keypoints_data, hand_right_keypoints_data] = put_hand_in_body(pose_keypoints_data, hand_left_keypoints_data, hand_right_keypoints_data);
    let pose_net = mediapipe_to_posenet(pose_keypoints_data);
    [pose_net, hand_left_keypoints_data, hand_right_keypoints_data] = chicken_neck_mediapipe(pose_net, hand_left_keypoints_data, hand_right_keypoints_data);
    return [pose_net, hand_left_keypoints_data, hand_right_keypoints_data];
}
