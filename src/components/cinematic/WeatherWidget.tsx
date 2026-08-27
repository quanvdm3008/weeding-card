import { motion } from "framer-motion";
import { Sun, Cloud, Droplets, Wind, Thermometer } from "lucide-react";

const WeatherWidget = ({ date, accentColor }: { date: string; accentColor: string }) => {
  const d = new Date(date);
  const isValid = !isNaN(d.getTime());
  const day = isValid ? d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" }) : "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative px-4 py-16"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-3xl p-6 @md:p-10 overflow-hidden border backdrop-blur-2xl"
          style={{
            background: `linear-gradient(135deg, ${accentColor}22, rgba(255,255,255,0.4))`,
            borderColor: `${accentColor}40`,
            boxShadow: `0 20px 60px -20px ${accentColor}55`,
          }}
        >
          {/* sun glow */}
          <motion.div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-40"
            style={{ background: accentColor }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          {/* floating clouds */}
          <motion.div
            className="absolute top-6 left-8 text-white/60"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <Cloud className="w-12 h-12" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-32 text-white/40"
            animate={{ x: [0, -16, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <Cloud className="w-8 h-8" />
          </motion.div>

          <div className="relative grid @sm:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[11px] tracking-[0.4em] uppercase font-body" style={{ color: accentColor }}>
                Wedding day weather
              </p>
              <p className="font-display text-2xl @md:text-3xl text-foreground mt-2 capitalize">{day}</p>
              <div className="flex items-end gap-3 mt-4">
                <motion.div
                  animate={{ rotate: [0, 12, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  style={{ color: accentColor }}
                >
                  <Sun className="w-16 h-16" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <p className="font-display text-6xl font-light text-foreground leading-none">28°</p>
                  <p className="font-body text-sm text-muted-foreground">Mild sunshine · clear sky</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Thermometer, label: "Feeling", value: "30°" },
                { icon: Droplets, label: "Humidity", value: "62%" },
                { icon: Wind, label: "Wind", value: "8 km/h" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-3 text-center backdrop-blur-md border"
                  style={{ background: "rgba(255,255,255,0.5)", borderColor: `${accentColor}33` }}
                >
                  <s.icon className="w-4 h-4 mx-auto" style={{ color: accentColor }} />
                  <p className="font-display text-lg font-semibold text-foreground mt-1">{s.value}</p>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default WeatherWidget;
