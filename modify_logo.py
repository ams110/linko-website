from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import io

# Open the original logo
original_logo = Image.open('logo.webp')

# Create a new image with RGBA mode (with transparency)
new_logo = Image.new('RGBA', original_logo.size, (0, 0, 0, 0))

# Paste the original logo onto the new image
new_logo.paste(original_logo, (0, 0))

# Convert to RGBA if not already
if new_logo.mode != 'RGBA':
    new_logo = new_logo.convert('RGBA')

# Get the pixel data
pixels = new_logo.load()

# Define the new colors (darker blue with gradient effect)
primary_blue = (0, 91, 159)  # Darker blue
secondary_blue = (0, 176, 255)  # Brighter blue for highlights
accent_blue = (0, 229, 255)  # Accent color for special elements

# Process each pixel
width, height = new_logo.size
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        
        # If it's a blue pixel (from the original logo)
        if b > r and b > g and a > 0:
            # Create a gradient effect based on position
            gradient_factor = y / height
            new_r = int(primary_blue[0] * (1 - gradient_factor) + secondary_blue[0] * gradient_factor)
            new_g = int(primary_blue[1] * (1 - gradient_factor) + secondary_blue[1] * gradient_factor)
            new_b = int(primary_blue[2] * (1 - gradient_factor) + secondary_blue[2] * gradient_factor)
            
            # Set the new color
            pixels[x, y] = (new_r, new_g, new_b, a)
        
        # If it's a white or light gray pixel (background)
        elif r > 200 and g > 200 and b > 200:
            # Make it transparent
            pixels[x, y] = (r, g, b, 0)

# Apply a subtle glow effect
glow = new_logo.filter(ImageFilter.GaussianBlur(radius=1))
enhancer = ImageEnhance.Brightness(glow)
glow = enhancer.enhance(1.2)

# Create the final image with glow effect
final_logo = Image.new('RGBA', new_logo.size, (0, 0, 0, 0))
final_logo.paste(glow, (0, 0), glow)
final_logo.paste(new_logo, (0, 0), new_logo)

# Save the modified logo
final_logo.save('logo_updated.webp', 'WEBP')

print("Logo has been modified and saved as logo_updated.webp")
