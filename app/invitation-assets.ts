const invitationImages = [
  '/entrance/wedding-set.webp',
  '/couple/laughter.webp',
  '/invitation.jpg',
];

function prepareImage(src: string) {
  return new Promise<void>(resolve => {
    const image = new Image();
    image.onload = () => {
      if (typeof image.decode === 'function') image.decode().catch(() => {}).then(resolve);
      else resolve();
    };
    image.onerror = () => resolve();
    image.src = src;
  });
}

// A failed image or slow connection must never trap guests on the loading screen.
export async function prepareInvitation(maximumWaitMs = 9000) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      Promise.allSettled([
        ...invitationImages.map(prepareImage),
        document.fonts?.ready ?? Promise.resolve(),
      ]),
      new Promise<void>(resolve => { timeout = setTimeout(resolve, maximumWaitMs); }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}
