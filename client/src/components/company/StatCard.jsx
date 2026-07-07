import React from 'react'

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="border border-line bg-paper p-5 flex items-center justify-between">
    <div>
      <p className="stamp text-gray-soft mb-1">{label}</p>
      <p className="font-display text-3xl">{value}</p>
    </div>
    {Icon && <Icon size={26} className="text-gray-soft" />}
  </div>
  )
}

export default StatCard
