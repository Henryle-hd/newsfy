"use client";
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'
import { motion } from 'framer-motion';

interface SummaryBarProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isLoading: boolean;
}

export default function SummaryBar({title,value,icon,isLoading}:SummaryBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="backdrop-blur-sm bg-white hover:shadow-sm transition-shadow rounded-md shadow-none">
          <CardContent className="flex items-center p-3 px-4 py-0">
              {isLoading ? (
                <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded" />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-xs sm:text-sm rounded-full bg-opacity-20 bg-red-600/20 p-2 flex items-center justify-center"
                >
                  {icon}
                </motion.div>
              )}
              <div className="ml-2 sm:ml-3">
                {isLoading ? (
                  <>
                    <Skeleton className="h-2 sm:h-3 w-[60px] sm:w-[80px] mb-1" />
                    <Skeleton className="h-4 sm:h-6 w-[40px] sm:w-[60px]" />
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <p className="text-[10px] sm:text-xs font-medium text-gray-600">{title}</p>
                    <h3 className="text-sm sm:text-base font-bold text-red-600">{value}</h3>
                  </motion.div>
                )}
              </div>
            </CardContent>
      </Card>
    </motion.div>
  )
}