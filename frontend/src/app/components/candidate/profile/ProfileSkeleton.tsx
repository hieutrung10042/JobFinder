import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function ProfileSkeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}