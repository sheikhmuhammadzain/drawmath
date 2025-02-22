import { motion } from 'framer-motion';
import { ChevronRight, Pen, Brain, Calculator, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <motion.section 
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <motion.h1 
            className="text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            variants={fadeInUp}
          >
            DrawMath
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-2xl text-gray-300"
            variants={fadeInUp}
          >
            Transform your handwritten equations into solutions instantly
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <button className="px-8 py-3 bg-blue-600 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors">
              Try Now <ChevronRight />
            </button>
            <button className="px-8 py-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          Why Choose DrawMath?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            className="bg-gray-800 p-6 rounded-2xl"
          >
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Pen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Writing</h3>
            <p className="text-gray-400">Write equations naturally with our intuitive drawing interface</p>
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="bg-gray-800 p-6 rounded-2xl"
          >
            <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Recognition</h3>
            <p className="text-gray-400">Advanced AI accurately recognizes your mathematical expressions</p>
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="bg-gray-800 p-6 rounded-2xl"
          >
            <div className="h-12 w-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Solutions</h3>
            <p className="text-gray-400">Get immediate results and step-by-step explanations</p>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          How It Works
        </motion.h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-800"></div>
            <motion.div 
              variants={fadeInUp}
              className="relative flex gap-8 mb-12"
            >
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Draw Your Equation</h3>
                <p className="text-gray-400">Use our canvas to write your mathematical equation naturally</p>
              </div>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="relative flex gap-8 mb-12"
            >
              <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Recognition</h3>
                <p className="text-gray-400">Our AI instantly recognizes and converts your handwriting</p>
              </div>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="relative flex gap-8"
            >
              <div className="h-16 w-16 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Your Solution</h3>
                <p className="text-gray-400">Receive instant solutions with beautiful mathematical formatting</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <motion.div 
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 p-8 sm:p-12 rounded-3xl"
        >
          <div className="inline-block p-3 bg-white/10 rounded-2xl mb-8">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Math Experience?</h2>
          <p className="text-xl text-gray-200 mb-8">Join thousands of students and professionals who are solving equations effortlessly</p>
          <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Get Started Free
          </button>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 DrawMath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 