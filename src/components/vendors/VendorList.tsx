import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Vendor } from '../../types';
import { 
  Store, 
  Phone, 
  DollarSign, 
  Star, 
  Plus, 
  Search,
  Filter,
  CheckCircle,
  Trash2,
  Edit2
} from 'lucide-react';
import { Button } from '../ui/Button';

export const VendorList: React.FC = () => {
  const { selectedEvent, addVendor, updateVendor, removeVendor } = useEvent();
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    type: '',
    contact: '',
    price: 0,
    rating: 0,
    booked: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBooked, setFilterBooked] = useState<boolean | null>(null);
  
  if (!selectedEvent) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Select an event to view vendors</p>
      </div>
    );
  }
  
  const handleAddVendor = () => {
    if (newVendor.name && newVendor.type) {
      addVendor(selectedEvent.id, newVendor);
      setNewVendor({
        name: '',
        type: '',
        contact: '',
        price: 0,
        rating: 0,
        booked: false,
      });
      setIsAddingVendor(false);
    }
  };
  
  const handleEditVendor = (vendor: Vendor) => {
    setNewVendor({
      name: vendor.name,
      type: vendor.type,
      contact: vendor.contact,
      price: vendor.price,
      rating: vendor.rating,
      booked: vendor.booked,
    });
    setEditingVendorId(vendor.id);
  };
  
  const handleUpdateVendor = () => {
    if (editingVendorId && newVendor.name && newVendor.type) {
      updateVendor(selectedEvent.id, editingVendorId, newVendor);
      setNewVendor({
        name: '',
        type: '',
        contact: '',
        price: 0,
        rating: 0,
        booked: false,
      });
      setEditingVendorId(null);
    }
  };
  
  const handleCancelEdit = () => {
    setNewVendor({
      name: '',
      type: '',
      contact: '',
      price: 0,
      rating: 0,
      booked: false,
    });
    setEditingVendorId(null);
    setIsAddingVendor(false);
  };
  
  const handleRemoveVendor = (vendorId: string) => {
    removeVendor(selectedEvent.id, vendorId);
  };
  
  const handleToggleBooked = (vendorId: string, booked: boolean) => {
    updateVendor(selectedEvent.id, vendorId, { booked });
  };
  
  // Filter and search vendors
  let filteredVendors = [...selectedEvent.vendors];
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredVendors = filteredVendors.filter(
      vendor =>
        vendor.name.toLowerCase().includes(query) ||
        vendor.type.toLowerCase().includes(query)
    );
  }
  
  if (filterBooked !== null) {
    filteredVendors = filteredVendors.filter(vendor => vendor.booked === filterBooked);
  }
  
  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Vendors</h2>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsAddingVendor(!isAddingVendor)}
            disabled={isAddingVendor || editingVendorId !== null}
          >
            Add Vendor
          </Button>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search vendors..."
              className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant={filterBooked === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterBooked(null)}
            >
              All
            </Button>
            <Button
              variant={filterBooked === true ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterBooked(true)}
            >
              Booked
            </Button>
            <Button
              variant={filterBooked === false ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterBooked(false)}
            >
              Not Booked
            </Button>
          </div>
        </div>
        
        {(isAddingVendor || editingVendorId) && (
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium mb-3">
              {editingVendorId ? 'Edit Vendor' : 'Add Vendor'}
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newVendor.name || ''}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newVendor.type || ''}
                    onChange={(e) => setNewVendor({ ...newVendor, type: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={newVendor.contact || ''}
                  onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newVendor.price || 0}
                    onChange={(e) => setNewVendor({ ...newVendor, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newVendor.rating || 0}
                    onChange={(e) => setNewVendor({ ...newVendor, rating: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="vendor-booked"
                  className="mr-2"
                  checked={newVendor.booked || false}
                  onChange={(e) => setNewVendor({ ...newVendor, booked: e.target.checked })}
                />
                <label htmlFor="vendor-booked" className="text-sm text-gray-700">
                  Already booked
                </label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={editingVendorId ? handleUpdateVendor : handleAddVendor}
                  disabled={!newVendor.name || !newVendor.type}
                >
                  {editingVendorId ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className={`border ${
                  vendor.booked ? 'border-green-200 bg-green-50' : 'border-gray-200'
                } rounded-lg p-4 shadow-sm`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-800">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.type}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-1 text-gray-400 hover:text-purple-600 focus:outline-none"
                      onClick={() => handleEditVendor(vendor)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-600 focus:outline-none"
                      onClick={() => handleRemoveVendor(vendor.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone size={14} className="mr-2 text-gray-500" />
                    <span>{vendor.contact}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <DollarSign size={14} className="mr-2 text-gray-500" />
                    <span>${vendor.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Star size={14} className="mr-2 text-yellow-500" />
                    <span>{vendor.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className={`text-sm ${vendor.booked ? 'text-green-600' : 'text-gray-500'}`}>
                    {vendor.booked ? 'Booked' : 'Not booked'}
                  </span>
                  <Button
                    variant={vendor.booked ? 'outline' : 'primary'}
                    size="sm"
                    leftIcon={vendor.booked ? undefined : <CheckCircle size={14} />}
                    onClick={() => handleToggleBooked(vendor.id, !vendor.booked)}
                  >
                    {vendor.booked ? 'Cancel Booking' : 'Book Now'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              <Store className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-gray-500 mb-1">No vendors found</p>
              <p className="text-xs text-gray-400">
                {searchQuery || filterBooked !== null
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding vendors'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};