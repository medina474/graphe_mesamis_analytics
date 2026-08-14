const R = 6371000;
const DEG2RAD = Math.PI / 180;
const lat0 = 48.75;
const lon0 = -4;

export class Geo {

   /**
     *
     * @param lat hectomètres
     * @param lon
     * @returns
     */
    public static coordToGraph(lat: number, lon: number) {
      const x =
        ((lon - lon0) * DEG2RAD * Math.cos(lat0 * DEG2RAD) * R) / 100.0;

      const y = ((lat - lat0) * DEG2RAD * R) / 100.0;

      return { x, y };
    }

}
