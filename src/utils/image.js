const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 6 * 1024 * 1024

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('We could not read that image. Please try another file.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('That image appears to be invalid. Please try another file.'))
    image.src = src
  })
}

export async function imageFileToDataUrl(file, { maxDimension = 1100, quality = 0.82 } = {}) {
  if (!file) throw new Error('Please choose an image file.')
  if (!ALLOWED_TYPES.includes(file.type))
    throw new Error('Please use a JPG, PNG or WebP image.')
  if (file.size > MAX_BYTES) throw new Error('Please choose an image smaller than 6 MB.')

  const dataUrl = await readFile(file)
  const image = await loadImage(dataUrl)
  const largest = Math.max(image.width, image.height)
  if (largest <= maxDimension) return dataUrl

  const scale = maxDimension / largest
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)
  const context = canvas.getContext('2d')
  if (!context) return dataUrl
  context.fillStyle = '#F4F5F8'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}
