import { bootstrapCameraKit, createMediaStreamSource } from "@snap/camera-kit";

(async function main() {
    const apiToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzExNjAxNjAyLCJzdWIiOiIyY2ZkMzFiZC1lMWFmLTQ1N2QtYWJmYy1hOThhNzkzMzRlMWZ-U1RBR0lOR34wOTM2YTE4NC00NjJiLTQ5YjgtOGZjYi05YzAwMDNmMmUwNzUifQ.xEpM3aiqXNU6uIM6w70BfsWag42WdXt3wnGv-hckOUk";
    const cameraKit = await bootstrapCameraKit({ apiToken });

    const liveRenderTarget = document.getElementById('my-canvas') as HTMLCanvasElement;
    const session = await cameraKit.createSession({ liveRenderTarget });
    session.events.addEventListener('error', (event) => {
      if (event.detail.error.name === 'LensExecutionError') {
        console.log('The current Lens encountered an error and was removed.', event.detail.error);
      }
    });

    // Determine if the device is likely a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Use 'user' facing mode for desktop, 'environment' for mobile
    const facingMode = isMobile ? "environment" : "user";

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode }
    });
    const source = createMediaStreamSource(stream);
    await session.setSource(source);
    await source.setRenderSize(1110, 1950);

    // Use different Lens IDs based on the device type
    const lensId = isMobile ? "93b19515-8a15-4df6-9005-de707a0b6e35" : "50507980875";
    const groupId = "663f5bb4-e694-4260-862f-8979394d866a";
    
    const lens = await cameraKit.lensRepository.loadLens(lensId, groupId);
    await session.applyLens(lens);

    await session.play();
    console.log("Lens rendering has started!");
})();
