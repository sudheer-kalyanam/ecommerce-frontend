// Mock Delivery Service API Integration
// This simulates integration with real delivery services like Blue Dart, DTDC, etc.

export interface DeliveryServiceResponse {
  success: boolean
  data?: {
    trackingNumber: string
    carrier: string
    status: string
    estimatedDelivery: string
    updates: Array<{
      status: string
      timestamp: string
      location: string
      description: string
    }>
  }
  error?: string
}

export interface DeliveryQuote {
  carrier: string
  service: string
  price: number
  estimatedDays: number
  features: string[]
}

export interface PincodeServiceability {
  serviceable: boolean
  carriers: DeliveryQuote[]
  estimatedDelivery: string
}

class MockDeliveryService {
  private carriers = [
    { name: 'Blue Dart', code: 'BLUEDART', basePrice: 80, speed: 'fast' },
    { name: 'DTDC', code: 'DTDC', basePrice: 60, speed: 'medium' },
    { name: 'Delhivery', code: 'DELHIVERY', basePrice: 70, speed: 'fast' },
    { name: 'Ecom Express', code: 'ECOM', basePrice: 50, speed: 'medium' },
    { name: 'XpressBees', code: 'XPRESSBEES', basePrice: 55, speed: 'medium' }
  ]

  private generateTrackingNumber(carrier: string): string {
    const carrierCode = this.carriers.find(c => c.name === carrier)?.code || 'UNK'
    const randomString = Math.random().toString(36).substr(2, 9).toUpperCase()
    return `${carrierCode}${randomString}`
  }

  private calculateDeliveryDays(fromPincode: string, toPincode: string, carrier: any): number {
    const fromRegion = parseInt(fromPincode.substring(0, 2))
    const toRegion = parseInt(toPincode.substring(0, 2))
    
    let baseDays = 2
    
    if (fromRegion === toRegion) {
      baseDays = 1
    } else if (Math.abs(fromRegion - toRegion) <= 5) {
      baseDays = 2
    } else {
      baseDays = 3
    }

    // Adjust based on carrier speed
    if (carrier.speed === 'fast') {
      baseDays = Math.max(1, baseDays - 1)
    } else if (carrier.speed === 'slow') {
      baseDays = baseDays + 1
    }

    return baseDays
  }

  private calculateDeliveryPrice(fromPincode: string, toPincode: string, carrier: any): number {
    const fromRegion = parseInt(fromPincode.substring(0, 2))
    const toRegion = parseInt(toPincode.substring(0, 2))
    
    let price = carrier.basePrice
    
    if (fromRegion === toRegion) {
      price = Math.max(0, price - 20) // Free or reduced for same region
    } else if (Math.abs(fromRegion - toRegion) > 10) {
      price = price + 30 // Extra for distant regions
    }

    return price
  }

  async checkPincodeServiceability(
    fromPincode: string, 
    toPincode: string
  ): Promise<PincodeServiceability> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock validation - assume all pincodes are serviceable
    const serviceable = this.validatePincode(fromPincode) && this.validatePincode(toPincode)
    
    if (!serviceable) {
      return {
        serviceable: false,
        carriers: [],
        estimatedDelivery: ''
      }
    }

    const carriers: DeliveryQuote[] = this.carriers.map(carrier => {
      const days = this.calculateDeliveryDays(fromPincode, toPincode, carrier)
      const price = this.calculateDeliveryPrice(fromPincode, toPincode, carrier)
      
      return {
        carrier: carrier.name,
        service: `${days} Day Delivery`,
        price,
        estimatedDays: days,
        features: [
          'Real-time Tracking',
          'SMS Updates',
          'Safe Handling',
          carrier.speed === 'fast' ? 'Express Delivery' : 'Standard Delivery'
        ]
      }
    })

    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.min(...carriers.map(c => c.estimatedDays)))

    return {
      serviceable: true,
      carriers,
      estimatedDelivery: estimatedDelivery.toISOString()
    }
  }

  async createShipment(
    orderId: string,
    fromAddress: {
      pincode: string
      address: string
      city: string
      state: string
    },
    toAddress: {
      pincode: string
      address: string
      city: string
      state: string
    },
    items: Array<{
      name: string
      quantity: number
      weight: number
    }>,
    preferredCarrier?: string
  ): Promise<DeliveryServiceResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      // Select carrier
      const carrier = preferredCarrier 
        ? this.carriers.find(c => c.name === preferredCarrier) || this.carriers[0]
        : this.carriers[0]

      const trackingNumber = this.generateTrackingNumber(carrier.name)
      const deliveryDays = this.calculateDeliveryDays(fromAddress.pincode, toAddress.pincode, carrier)
      
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays)

      const updates = [
        {
          status: 'PENDING',
          timestamp: new Date().toISOString(),
          location: 'Origin Hub',
          description: 'Shipment created and ready for pickup'
        }
      ]

      return {
        success: true,
        data: {
          trackingNumber,
          carrier: carrier.name,
          status: 'PENDING',
          estimatedDelivery: estimatedDelivery.toISOString(),
          updates
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create shipment'
      }
    }
  }

  async trackShipment(trackingNumber: string): Promise<DeliveryServiceResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      // Mock tracking data based on tracking number
      const carrier = this.carriers.find(c => trackingNumber.startsWith(c.code)) || this.carriers[0]
      
      // Generate realistic tracking updates
      const now = new Date()
      const updates = [
        {
          status: 'PENDING',
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Origin Hub',
          description: 'Shipment created and ready for pickup'
        },
        {
          status: 'CONFIRMED',
          timestamp: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Origin Hub',
          description: 'Shipment confirmed and payment verified'
        },
        {
          status: 'PROCESSING',
          timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Warehouse',
          description: 'Package is being prepared for shipment'
        },
        {
          status: 'SHIPPED',
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
          location: 'Origin Hub',
          description: 'Package has been shipped'
        }
      ]

      // Add more updates based on time
      if (now.getTime() - new Date(updates[3].timestamp).getTime() > 6 * 60 * 60 * 1000) {
        updates.push({
          status: 'IN_TRANSIT',
          timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          location: 'Transit Hub',
          description: 'Package is in transit to destination'
        })
      }

      if (now.getTime() - new Date(updates[3].timestamp).getTime() > 20 * 60 * 60 * 1000) {
        updates.push({
          status: 'OUT_FOR_DELIVERY',
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          location: 'Local Hub',
          description: 'Package is out for delivery'
        })
      }

      if (now.getTime() - new Date(updates[3].timestamp).getTime() > 24 * 60 * 60 * 1000) {
        updates.push({
          status: 'DELIVERED',
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          location: 'Destination',
          description: 'Package has been delivered successfully'
        })
      }

      const currentStatus = updates[updates.length - 1].status
      const estimatedDelivery = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()

      return {
        success: true,
        data: {
          trackingNumber,
          carrier: carrier.name,
          status: currentStatus,
          estimatedDelivery,
          updates: updates.reverse() // Show latest first
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to track shipment'
      }
    }
  }

  async updateShipmentStatus(
    trackingNumber: string, 
    status: string, 
    location: string, 
    description: string
  ): Promise<DeliveryServiceResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      // In a real implementation, this would update the shipment status
      // For mock purposes, we'll just return success
      return {
        success: true,
        data: {
          trackingNumber,
          carrier: 'Mock Carrier',
          status,
          estimatedDelivery: new Date().toISOString(),
          updates: [{
            status,
            timestamp: new Date().toISOString(),
            location,
            description
          }]
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update shipment status'
      }
    }
  }

  private validatePincode(pincode: string): boolean {
    // Indian pincode validation (6 digits, first digit 1-9)
    const pincodeRegex = /^[1-9][0-9]{5}$/
    return pincodeRegex.test(pincode)
  }

  // Utility method to get delivery quotes for multiple carriers
  async getDeliveryQuotes(
    fromPincode: string,
    toPincode: string
  ): Promise<DeliveryQuote[]> {
    const serviceability = await this.checkPincodeServiceability(fromPincode, toPincode)
    return serviceability.carriers
  }

  // Utility method to estimate delivery date
  async estimateDeliveryDate(
    fromPincode: string,
    toPincode: string,
    carrier?: string
  ): Promise<{ date: string; days: number }> {
    const selectedCarrier = carrier 
      ? this.carriers.find(c => c.name === carrier) || this.carriers[0]
      : this.carriers[0]

    const days = this.calculateDeliveryDays(fromPincode, toPincode, selectedCarrier)
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + days)

    return {
      date: deliveryDate.toISOString(),
      days
    }
  }
}

// Export singleton instance
export const deliveryService = new MockDeliveryService()

// Export types for use in components
export type { DeliveryServiceResponse, DeliveryQuote, PincodeServiceability }
