<template>
  <div :style="{ backgroundColor: bgColor }" class="tag">
    <span class="name"
          contenteditable="true"
          spellcheck="false"
          @input="updateTagName">
      {{ name }}
    </span>
    <button :style="{ backgroundColor: bgColorCloseButton }"
            class="tag-delete-btn material-symbols-outlined"
            type="button"
            @click="$emit('deleteTag')"
    >
      close
    </button>

    <tag-context-menu :tag="tag" @delete-tag="$emit('deleteTag')"></tag-context-menu>
  </div>
</template>

<script>
import TagContextMenu from "@/components/contextMenu/TagContextMenu";

export default {
  name: "Tag",
  components: { TagContextMenu },
  emits: ["deleteTag"],
  props: {
    tag: {
      type: Object,
      required: true,
    },
    enforceSameHslLightingValue: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    id() {
      return this.tag.id;
    },
    name() {
      return this.tag.name;
    },
    color() {
      // Return default color if none is available
      return (this.tag.color != null) ? this.tag.color : "#ffcc00";
    },
    colorAsHsl() {
      if (this.isHslColorString(this.color)) return this.color;

      let rgb;
      if (this.colorNameToHex(this.color) != null) {
        const hex = this.colorNameToHex(this.color);
        rgb = this.hexToRgb(hex);
      } else if (this.isCssRgbColor(this.color)) {
        rgb = this.cssRgbStringToRgb(this.color);
      } else if (this.isHexColorString(this.color)) {
        rgb = this.hexToRgb(this.color);
      } else {
        throw new Error("Unknown color format");
      }

      return this.rgbToHsl(rgb[0], rgb[1], rgb[2]);
    },
    bgColor() {
      if (this.enforceSameHslLightingValue) {
        const hsl = this.colorAsHsl;
        return `hsla(${ hsl[0] }, ${ hsl[1] }%, ${ this.hslLightAmount }%, 0.7)`;
      }

      return this.color;
    },
    bgColorCloseButton() {
      const hsl = this.colorAsHsl;
      return `hsla(${ hsl[0] }, ${ hsl[1] }%, ${ this.hslLightAmountCloseButton }%, 0.7)`;
    },
    hslLightAmountCloseButton() {
      return Math.max(this.hslLightAmount - 20, 0);
    },
  },
  methods: {
    isHexColorString(string) {
      // Source: https://stackoverflow.com/a/8027444/9258134
      return /^#[0-9A-F]{6}$/i.test(string) || /^#([0-9A-F]{3}){1,2}$/i.test(string);
    },
    isHslColorString(string) {
      const regExp = /^hsl\(\s*(0|[1-9]\d?|[12]\d\d|3[0-5]\d)\s*,\s*((0|[1-9]\d?|100)%)\s*,\s*((0|[1-9]\d?|100)%)\s*\)$/;
      return regExp.test(string);
    },
    isCssRgbColor(string) {
      // Source: https://gist.github.com/Safareli/10603775
      const regExp = /^rgb\(\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%?\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%?\s*,\s*(0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%?\s*\)$/;
      return regExp.test(string);
    },
    cssRgbStringToRgb(string) {
      if (!this.isCssRgbColor(string)) throw new Error("Not a valid CSS RGB string");

      const values = string.split("(")[1].split(")")[0].split(",");

      for (const value of values) {
        if (value < 0 || value >= 256) throw new Error("Color values is out of range");
      }

      return values;
    },
    hexToRgb(string) {
      let r, g, b;
      if (/^#[0-9A-F]{6}$/i.test(string)) {
        // 6-character HEX code, e.g., #fafafa
        r = parseInt(string.substring(1, 3), 16);
        g = parseInt(string.substring(3, 5), 16);
        b = parseInt(string.substring(5, 7), 16);
      } else if (/^#([0-9A-F]{3}){1,2}$/i.test(string)) {
        // 3-character HEX code, e.g., #f0a
        r = parseInt(string.substring(1, 2), 16);
        g = parseInt(string.substring(2, 3), 16);
        b = parseInt(string.substring(3, 4), 16);
      } else {
        throw new Error("Argument is not a HEX color code");
      }

      return [r, g, b];
    },
    rgbToHsl(r, g, b) {
      // Make r, g, and b fractions of 1
      r /= 255;
      g /= 255;
      b /= 255;

      // Find greatest and smallest channel values
      const cmin = Math.min(r, g, b);
      const cmax = Math.max(r, g, b);
      const delta = cmax - cmin;
      let h = 0;
      let s = 0;
      let l = 0;

      // Calculate hue
      // No difference
      if (delta === 0) h = 0;
      // Red is max
      else if (cmax === r) h = ((g - b) / delta) % 6;
      // Green is max
      else if (cmax === g) h = (b - r) / delta + 2;
      // Blue is max
      else h = (r - g) / delta + 4;

      h = Math.round(h * 60);

      // Make negative hues positive behind 360°
      if (h < 0) h += 360;

      // Calculate lightness
      l = (cmax + cmin) / 2;

      // Calculate saturation
      s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

      // Multiply l and s by 100
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);

      return [h, s, l];
    },
    colorNameToHex(color) {
      const colors = {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgreen": "#006400",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00",
        "darkorchid": "#9932cc",
        "darkred": "#8b0000",
        "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f",
        "darkslateblue": "#483d8b",
        "darkslategray": "#2f4f4f",
        "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3",
        "deeppink": "#ff1493",
        "deepskyblue": "#00bfff",
        "dimgray": "#696969",
        "dodgerblue": "#1e90ff",
        "firebrick": "#b22222",
        "floralwhite": "#fffaf0",
        "forestgreen": "#228b22",
        "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff",
        "gold": "#ffd700",
        "goldenrod": "#daa520",
        "gray": "#808080",
        "green": "#008000",
        "greenyellow": "#adff2f",
        "honeydew": "#f0fff0",
        "hotpink": "#ff69b4",
        "indianred ": "#cd5c5c",
        "indigo": "#4b0082",
        "ivory": "#fffff0",
        "khaki": "#f0e68c",
        "lavender": "#e6e6fa",
        "lavenderblush": "#fff0f5",
        "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd",
        "lightblue": "#add8e6",
        "lightcoral": "#f08080",
        "lightcyan": "#e0ffff",
        "lightgoldenrodyellow": "#fafad2",
        "lightgrey": "#d3d3d3",
        "lightgreen": "#90ee90",
        "lightpink": "#ffb6c1",
        "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa",
        "lightskyblue": "#87cefa",
        "lightslategray": "#778899",
        "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0",
        "lime": "#00ff00",
        "limegreen": "#32cd32",
        "linen": "#faf0e6",
        "magenta": "#ff00ff",
        "maroon": "#800000",
        "mediumaquamarine": "#66cdaa",
        "mediumblue": "#0000cd",
        "mediumorchid": "#ba55d3",
        "mediumpurple": "#9370d8",
        "mediumseagreen": "#3cb371",
        "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a",
        "mediumturquoise": "#48d1cc",
        "mediumvioletred": "#c71585",
        "midnightblue": "#191970",
        "mintcream": "#f5fffa",
        "mistyrose": "#ffe4e1",
        "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead",
        "navy": "#000080",
        "oldlace": "#fdf5e6",
        "olive": "#808000",
        "olivedrab": "#6b8e23",
        "orange": "#ffa500",
        "orangered": "#ff4500",
        "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98",
        "paleturquoise": "#afeeee",
        "palevioletred": "#d87093",
        "papayawhip": "#ffefd5",
        "peachpuff": "#ffdab9",
        "peru": "#cd853f",
        "pink": "#ffc0cb",
        "plum": "#dda0dd",
        "powderblue": "#b0e0e6",
        "purple": "#800080",
        "rebeccapurple": "#663399",
        "red": "#ff0000",
        "rosybrown": "#bc8f8f",
        "royalblue": "#4169e1",
        "saddlebrown": "#8b4513",
        "salmon": "#fa8072",
        "sandybrown": "#f4a460",
        "seagreen": "#2e8b57",
        "seashell": "#fff5ee",
        "sienna": "#a0522d",
        "silver": "#c0c0c0",
        "skyblue": "#87ceeb",
        "slateblue": "#6a5acd",
        "slategray": "#708090",
        "snow": "#fffafa",
        "springgreen": "#00ff7f",
        "steelblue": "#4682b4",
        "tan": "#d2b48c",
        "teal": "#008080",
        "thistle": "#d8bfd8",
        "tomato": "#ff6347",
        "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3",
        "white": "#ffffff",
        "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32",
      };

      return colors[color.toLowerCase()];
    },
    updateTagName(event) {
      const name = event.target.innerText;
      const data = event.data?.replaceAll("\n", "");

      if (data != null && name.length + data.length >= 30) {
        // Reset inner text to last text
        event.target.innerText = this.name;
      } else {
        this.$store.dispatch("updateTag", { tagId: this.id, name });
      }
    },
  },
  data() {
    return {
      hslLightAmount: 45,
    };
  },
};
</script>

<style lang="scss">
.tag {
  display: flex;
  align-items: center;
  padding: 0.1rem 0.25rem;
  border-radius: 1rem;
  font-size: 0.6rem;
  gap: 0.5em;

  .name {
    font-family: monospace;
    white-space: nowrap;

    &:focus {
      outline: none;
    }
  }

  .tag-delete-btn {
    font-size: inherit;
    border-radius: 100%;
    border: none;

  }
}
</style>
