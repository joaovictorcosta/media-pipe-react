import { createRef, useEffect } from 'react'
import { Holistic } from '@mediapipe/holistic/holistic'
import {
  drawConnectors,
  drawLandmarks,
  lerp,
} from '@mediapipe/drawing_utils/drawing_utils'
import { POSE_CONNECTIONS, POSE_LANDMARKS } from '@mediapipe/pose/pose'

import {
  FACEMESH_TESSELATION,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS,
} from '@mediapipe/face_mesh/face_mesh'
import { HAND_CONNECTIONS } from '@mediapipe/hands/hands'

import { Camera } from '@mediapipe/camera_utils/camera_utils'

function App() {
  const canvasElementRef = createRef()
  const videoElementRef = createRef()
  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
      },
    })
    holistic.setOptions({
      upperBodyOnly: true,
      smoothLandmarks: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    const camera = new Camera(videoElementRef.current, {
      onFrame: async () => {
        await holistic.send({ image: videoElementRef.current })
      },
      width: 1280,
      height: 720,
    })
    holistic.onResults(onResults)
    camera.start()
  }, [])

  function removeElements(landmarks, elements) {
    for (const element of elements) {
      delete landmarks[element]
    }
  }

  function onResults(results) {
    const canvasCtx = canvasElementRef.current.getContext('2d')
    const canvasElement = canvasElementRef.current

    removeLandmarks(results)

    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    )

   
    canvasCtx.lineWidth = 1
    if (results.poseLandmarks) {
      if (results.rightHandLandmarks) {
        canvasCtx.strokeStyle = '#00FF00'
        connect(canvasCtx, [
          [
            results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW],
            results.rightHandLandmarks[0],
          ],
        ])
      }
      if (results.leftHandLandmarks) {
        canvasCtx.strokeStyle = '#FF0000'
        connect(canvasCtx, [
          [
            results.poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW],
            results.leftHandLandmarks[0],
          ],
        ])
      }
    }

  
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 1
    })
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: '#00FF00',
      fillColor: '#FF0000',
      lineWidth: 1
    })

    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
      color: '#00CC00',
      lineWidth: 1,
    })
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {
      color: '#00FF00',
      fillColor: '#FF0000',
      lineWidth: 0.5,
      radius: (data) => {
        return lerp(data.from.z, -0.15, 0.1, 2, 1)
      },
    })
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
      color: '#CC0000',
      lineWidth: 1,
    })
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {
      color: '#FF0000',
      fillColor: '#00FF00',
      lineWidth:  0.5,
      radius: (data) => {
        return lerp(data.from.z, -0.15, 0.1, 2, 1)
      },
    })


    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
      color: '#C0C0C070',
      lineWidth: 1,
    })
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {
      color: '#FF3030',
      lineWidth: 2,
    })
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, {
      color: '#FF3030',
      lineWidth: 2,
    })
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {
      color: '#30FF30',
      lineWidth: 2,
    })
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, {
      color: '#30FF30',
      lineWidth: 2,
    })
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {
      color: '#E0E0E0',
      lineWidth: 2,
    })
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {
      color: '#E0E0E0',
      lineWidth: 2,
    })

    canvasCtx.restore()
  }

  function removeLandmarks(results) {
    if (results.poseLandmarks) {
      removeElements(results.poseLandmarks, [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
      ])
    }
  }

  function connect(ctx, connectors) {
    const canvas = ctx.canvas
    for (const connector of connectors) {
      const from = connector[0]
      const to = connector[1]
      if (from && to) {
        if (
          from.visibility &&
          to.visibility &&
          (from.visibility < 0.1 || to.visibility < 0.1)
        ) {
          continue
        }
        ctx.beginPath()
        ctx.moveTo(from.x * canvas.width, from.y * canvas.height)
        ctx.lineTo(to.x * canvas.width, to.y * canvas.height)
        ctx.stroke()
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <video
          style={{
            position: 'relative',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
          }}
          ref={videoElementRef}
        ></video>
        <canvas
          ref={canvasElementRef}
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '1280px',
            height: '720px',
          }}
        ></canvas>
      </header>
    </div>
  )
}

export default App
