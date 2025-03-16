"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface VictoryAnimationProps {
  isVisible: boolean
}

const VictoryAnimation: React.FC<VictoryAnimationProps> = ({ isVisible }) => {
  if (!isVisible) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const confettiColors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#9C27B0']

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Confetti particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: confettiColors[i % confettiColors.length],
            left: `${Math.random() * 100}%`,
            top: '-10px'
          }}
          initial={{ y: -10 }}
          animate={{
            y: ['0%', '100%'],
            x: [
              '0%',
              `${(Math.random() - 0.5) * 100}%`,
              `${(Math.random() - 0.5) * 200}%`
            ],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random()
          }}
        />
      ))}

      {/* Victory message */}
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center"
        variants={itemVariants}
      >
        <motion.h2
          className="text-4xl font-bold text-green-500 mb-4"
          variants={itemVariants}
        >
          Congratulations!
        </motion.h2>
        <motion.div
          className="text-xl text-gray-700"
          variants={itemVariants}
        >
          🎉 You won! 🎉
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default VictoryAnimation 