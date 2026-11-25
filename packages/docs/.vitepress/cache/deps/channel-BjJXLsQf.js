import { nt as Utils, tt as Color } from "./chunk-ABZYJK2D-DaRgM5H6.js";
// ../../node_modules/.pnpm/khroma@2.1.0/node_modules/khroma/dist/methods/channel.js
var channel = (color, channel) => {
	return Utils.lang.round(Color.parse(color)[channel]);
};
export { channel as t };
