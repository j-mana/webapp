'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import SearchIcon from '@/icons/SearchIcon'
import TabGroup from '@/components/TabGroup'
import GridIcon from '@/icons/GridIcon'

// Sample data - replace with real data from your database
const visitorData = [
  { date: 'Jul 6', visitors: 800 },
  { date: 'Jul 7', visitors: 1200 },
  { date: 'Jul 8', visitors: 1800 },
  { date: 'Jul 9', visitors: 1600 },
  { date: 'Jul 10', visitors: 2200 },
  { date: 'Jul 11', visitors: 2800 },
  { date: 'Jul 12', visitors: 2400 },
  { date: 'Jul 13', visitors: 3200 },
  { date: 'Jul 14', visitors: 2800 },
  { date: 'Jul 15', visitors: 3000 },
  { date: 'Jul 16', visitors: 2600 },
]

const variantData = [
  { name: 'Control', split: '15%', visitors: 4500, conversionRate: '18%', conversions: 900, lift: '+2.8%' },
  { name: 'Variant A', split: '25%', visitors: 5200, conversionRate: '22%', conversions: 1200, lift: '+4.0%' },
  { name: 'Variant B', split: '30%', visitors: 6100, conversionRate: '16%', conversions: 980, lift: '-1.2%' },
  { name: 'Variant C', split: '30%', visitors: 6200, conversionRate: '24%', conversions: 1488, lift: '+6.5%' },
]

export default function Analytics() {
  const [selectedTab, setSelectedTab] = useState('summary')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'summary', label: 'Summary'},
    { id: 'variant-a', label: 'Variant A' },
    { id: 'variant-b', label: 'Variant B' },
    { id: 'variant-c', label: 'Variant C' },
    { id: 'variant-d', label: 'Variant D' }
  ]

  return (
    <div className="flex flex-col h-full bg-white p-6 divide-y divide-border-light">

      {/* Tabs */}
      <div className='flex flex-row items-center justify-between'>
        <div className="mb-6">
          <TabGroup
            tabs={tabs}
            defaultTab="summary"
            onTabChange={setSelectedTab}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-5 gap-6 py-10 border-b border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Unique Visitors</p>
          <p className="text-2xl font-semibold mt-1">25.0k</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Page Views</p>
          <p className="text-2xl font-semibold mt-1">50.0k</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Bounce Rate</p>
          <p className="text-2xl font-semibold mt-1">45.0%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-semibold mt-1">15.0%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Average Session</p>
          <p className="text-2xl font-semibold mt-1">30s</p>
        </div>
      </div>

      {/* Chart */}
      <div className="py-10">
        <h3 className="text-sm font-medium mb-4 ml-6">Visitors</h3>
        <div className="h-64 relative" style={{
          backgroundImage: `radial-gradient(circle, #000000 0.5px, transparent 0.5px)`,
          backgroundSize: '10px 10px',
          backgroundPosition: '0 0, 5px 5px'
        }}>
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              background: `radial-gradient(circle at center, 
                rgba(255, 255, 255, 0) 0%, 
                rgba(255, 255, 255, 0.8) 60%, 
                rgba(255, 255, 255, 0.95) 100%)`
            }}
          />
          {/* Gradient overlay from top to bottom */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              background: `linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(255, 255, 255, 0.2) 60%, 
                rgba(255, 255, 255, 0.9) 100%)`
            }}
          />
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitorData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2F8CF94D" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#2F8CF94D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  padding: '8px 12px'
                }}
              />
              <Area 
                type="linear" 
                dataKey="visitors" 
                stroke="#2F8CF9" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorVisitors)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Variants Table */}
      <div className="flex-1 py-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Variants</h3>
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort
            </button>
            <div className="relative">
              <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 pr-6">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="pb-3 pr-6">Variant</th>
                <th className="pb-3 pr-6">Split</th>
                <th className="pb-3 pr-6">Total Visitors</th>
                <th className="pb-3 pr-6">Conversion Rate</th>
                <th className="pb-3 pr-6">Conversions</th>
                <th className="pb-3 pr-6">Lift</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {variantData.map((variant) => (
                <tr key={variant.name} className="hover:bg-gray-50">
                  <td className="py-3 pr-6">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="py-3 pr-6 font-medium">{variant.name}</td>
                  <td className="py-3 pr-6">{variant.split}</td>
                  <td className="py-3 pr-6">{variant.visitors.toLocaleString()}</td>
                  <td className="py-3 pr-6">{variant.conversionRate}</td>
                  <td className="py-3 pr-6">{variant.conversions.toLocaleString()}</td>
                  <td className="py-3 pr-6">
                    <span className={`font-medium ${variant.lift.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {variant.lift}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button className="text-sm text-gray-500 hover:text-gray-700">
            Ask about the data...
          </button>
        </div>
      </div>
    </div>
  )
} 