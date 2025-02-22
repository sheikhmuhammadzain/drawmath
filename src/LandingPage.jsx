import { motion } from 'framer-motion';
import { ArrowForward, Edit, Psychology, Calculate } from '@mui/icons-material';
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* Hero Section */}
      <HeroHighlight>
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight">
              Draw<Highlight>Math</Highlight>
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-400 max-w-2xl mx-auto">
              Transform your handwritten equations into solutions with minimal effort
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/solve"
                className="px-8 py-3 bg-neutral-800 rounded-lg flex items-center gap-2 hover:bg-neutral-700 transition-all border border-neutral-700"
              >
                Try Now <ArrowForward className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </HeroHighlight>

      {/* Features Section */}
      <section className="py-20 px-4">
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
              className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800"
            >
              <Edit className="h-6 w-6 mb-4 text-neutral-400" />
              <h3 className="text-xl font-medium mb-2">Natural Writing</h3>
              <p className="text-neutral-400 text-sm">Write equations naturally with our intuitive interface</p>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800"
            >
              <Psychology className="h-6 w-6 mb-4 text-neutral-400" />
              <h3 className="text-xl font-medium mb-2">Smart Recognition</h3>
              <p className="text-neutral-400 text-sm">Advanced AI recognizes your mathematical expressions</p>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800"
            >
              <Calculate className="h-6 w-6 mb-4 text-neutral-400" />
              <h3 className="text-xl font-medium mb-2">Instant Solutions</h3>
              <p className="text-neutral-400 text-sm">Get immediate results with beautiful formatting</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-neutral-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="flex gap-8 items-start">
              <span className="text-5xl font-bold text-neutral-700">01</span>
              <div>
                <h3 className="text-xl font-medium mb-2">Draw Your Equation</h3>
                <p className="text-neutral-400 text-sm">Write naturally on our minimal canvas</p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex gap-8 items-start">
              <span className="text-5xl font-bold text-neutral-700">02</span>
              <div>
                <h3 className="text-xl font-medium mb-2">AI Recognition</h3>
                <p className="text-neutral-400 text-sm">Our AI converts your handwriting instantly</p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex gap-8 items-start">
              <span className="text-5xl font-bold text-neutral-700">03</span>
              <div>
                <h3 className="text-xl font-medium mb-2">Get Your Solution</h3>
                <p className="text-neutral-400 text-sm">Receive clean, formatted solutions</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800"
          >
            <h2 className="text-3xl font-medium mb-4">Ready to start?</h2>
            <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
              Join others who are solving equations effortlessly
            </p>
            <Link 
              to="/solve"
              className="inline-block px-8 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-all border border-neutral-700"
            >
              Try for free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto text-center text-neutral-500 text-sm">
          <p>© 2024 DrawMath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 