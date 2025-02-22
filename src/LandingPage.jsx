import { motion } from 'framer-motion';
import { ArrowForward, Edit, Psychology, Calculate, Star, CheckCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { HeroHighlight, Highlight } from './components/ui/hero-highlight';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Mathematics Teacher",
    content: "DrawMath has revolutionized how I teach equations to my students. The instant recognition is remarkable.",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Student",
    content: "This tool helped me understand complex equations better. The visual feedback is incredibly helpful.",
    rating: 5
  },
  {
    name: "Dr. Emily Brown",
    role: "Professor",
    content: "An excellent tool for both teaching and research. The accuracy is impressive.",
    rating: 5
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-200">
      {/* Hero Section */}
      <HeroHighlight>
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <div className="inline-block mb-4 px-4 py-1.5 bg-neutral-900/50 rounded-full border border-neutral-800">
              <span className="text-sm font-medium text-blue-300">
                Powered by Advanced AI Technology
              </span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-white">
              Draw<span className="text-blue-400">Math</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white max-w-2xl mx-auto leading-relaxed">
              Transform your handwritten equations into solutions with minimal effort
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/solve"
                className="group px-8 py-3 bg-blue-500 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg text-white"
              >
                Try Now 
                <ArrowForward className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">No Sign-up Required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </HeroHighlight>

      {/* Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div 
              variants={fadeInUp}
              className="group p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all hover:bg-neutral-800/50"
            >
              <div className="rounded-lg bg-neutral-800/50 w-12 h-12 flex items-center justify-center mb-6">
                <Edit className="h-6 w-6 text-neutral-300" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-neutral-200">Natural Writing</h3>
              <p className="text-neutral-400 leading-relaxed">Write equations naturally with our intuitive interface. Experience seamless input with real-time feedback.</p>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="group p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all hover:bg-neutral-800/50"
            >
              <div className="rounded-lg bg-neutral-800/50 w-12 h-12 flex items-center justify-center mb-6">
                <Psychology className="h-6 w-6 text-neutral-300" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-neutral-200">Smart Recognition</h3>
              <p className="text-neutral-400 leading-relaxed">Advanced AI recognizes your mathematical expressions with high accuracy and minimal latency.</p>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="group p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all hover:bg-neutral-800/50"
            >
              <div className="rounded-lg bg-neutral-800/50 w-12 h-12 flex items-center justify-center mb-6">
                <Calculate className="h-6 w-6 text-neutral-300" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-neutral-200">Instant Solutions</h3>
              <p className="text-neutral-400 leading-relaxed">Get immediate results with beautiful formatting. Complex equations solved in seconds.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-4 bg-neutral-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-5" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">How It Works</h2>
            <p className="text-neutral-400">Three simple steps to solve your equations</p>
          </motion.div>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <motion.div variants={fadeInUp} className="flex gap-8 items-start group">
              <span className="text-6xl font-bold bg-gradient-to-r from-neutral-700 to-neutral-600 bg-clip-text text-transparent group-hover:from-neutral-600 group-hover:to-neutral-500 transition-all">01</span>
              <div>
                <h3 className="text-2xl font-medium mb-3">Draw Your Equation</h3>
                <p className="text-neutral-400 leading-relaxed">Write naturally on our minimal canvas. Our interface adapts to your writing style for the best experience.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex gap-8 items-start group">
              <span className="text-6xl font-bold bg-gradient-to-r from-neutral-700 to-neutral-600 bg-clip-text text-transparent group-hover:from-neutral-600 group-hover:to-neutral-500 transition-all">02</span>
              <div>
                <h3 className="text-2xl font-medium mb-3">AI Recognition</h3>
                <p className="text-neutral-400 leading-relaxed">Our advanced AI instantly converts your handwriting into digital format with high precision.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex gap-8 items-start group">
              <span className="text-6xl font-bold bg-gradient-to-r from-neutral-700 to-neutral-600 bg-clip-text text-transparent group-hover:from-neutral-600 group-hover:to-neutral-500 transition-all">03</span>
              <div>
                <h3 className="text-2xl font-medium mb-3">Get Your Solution</h3>
                <p className="text-neutral-400 leading-relaxed">Receive clean, formatted solutions instantly. Review, edit, and export your results.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">What Users Say</h2>
            <p className="text-neutral-400">Trusted by students and educators worldwide</p>
          </motion.div>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-neutral-400" />
                  ))}
                </div>
                <p className="text-neutral-300 mb-6 leading-relaxed">{testimonial.content}</p>
                <div>
                  <p className="font-medium text-neutral-200">{testimonial.name}</p>
                  <p className="text-sm text-neutral-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-900/50 border border-neutral-800"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">Ready to start?</h2>
            <p className="text-neutral-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of users who are solving equations effortlessly with DrawMath
            </p>
            <Link 
              to="/solve"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-lg hover:from-neutral-700 hover:to-neutral-600 transition-all border border-neutral-700 shadow-lg group"
            >
              Try for free
              <ArrowForward className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-neutral-900/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-neutral-500 text-sm">
            © 2024 DrawMath. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
