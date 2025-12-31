import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import { Helmet } from 'react-helmet';
import AdminLayout from '../components/admin/AdminLayout'; // ✅ Updated import
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { X } from 'lucide-react';

const AdminProfile = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('Account Settings');
    const [user, setUser] = useState({
        first_name: '', last_name: '', email: '', mobile: '',
        bio: '', address: '', country: '', state: '', city: '', pincode: '',
        languages: []
    });
    const [image, setImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Admin");
    const [selectedFile, setSelectedFile] = useState(null);
    const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' });

    // Tags for languages
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                headers: { 'Authorization': token }
            });
            const data = await res.json();
            if (res.ok) {
                // Ensure languages is an array
                if (data.languages && !Array.isArray(data.languages)) {
                    // if it comes as string {English,French} from postgres text[] sometimes depending on driver config
                    // but pg driver usually returns array. If it's null, default to []
                    data.languages = [];
                }

                setUser({ ...data, languages: data.languages || [] });

                if (data.profile_pic) {
                    const imgUrl = data.profile_pic.startsWith('http') ? data.profile_pic : `http://localhost:5000${data.profile_pic}`;
                    setImage(imgUrl);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            Object.keys(user).forEach(key => {
                if (key === 'languages') {
                    formData.append(key, user[key].join(',')); // Send as comma joined string for simplicity or JSON
                } else {
                    formData.append(key, user[key] || '');
                }
            });

            if (selectedFile) {
                formData.append('profile_pic', selectedFile);
            }

            const res = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: { 'Authorization': token },
                body: formData
            });

            if (res.ok) {
                toast({ title: "Profile updated successfully" });
                fetchProfile(); // Refresh
            } else {
                toast({ title: "Update failed", variant: "destructive" });
            }
        } catch (err) {
            console.error(err);
            toast({ title: "Update failed", variant: "destructive" });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_password) {
            return toast({ title: "Passwords do not match", variant: "destructive" });
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
                body: JSON.stringify({
                    current_password: passwords.current_password,
                    new_password: passwords.new_password
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast({ title: "Password updated successfully" });
                setPasswords({ current_password: '', new_password: '', confirm_password: '' });
            } else {
                toast({ title: data.message || "Failed", variant: "destructive" });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setSelectedFile(file);
        }
    };

    const addLanguage = () => {
        if (newTag && !user.languages.includes(newTag)) {
            setUser({ ...user, languages: [...(user.languages || []), newTag] });
            setNewTag('');
        }
    };

    const removeLanguage = (tag) => {
        setUser({ ...user, languages: user.languages.filter(t => t !== tag) });
    };

    return (
        <AdminLayout>
            <Helmet><title>Settings | MaitriConnect Admin</title></Helmet>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Settings</h1></div>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
                        {['Account Settings', 'Security'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setActiveTab(item)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item
                                    ? 'text-[#D3043C] bg-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        {activeTab === 'Account Settings' && (
                            <>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                                <div className="mb-8 flex items-center gap-6">
                                    <img src={image} alt="Profile" className="w-24 h-24 rounded-full bg-gray-100 object-cover" />
                                    <div className="relative">
                                        <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        <Button asChild variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 cursor-pointer">
                                            <label htmlFor="profile-upload">Upload</label>
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2"><Label>First Name</Label><Input value={user.first_name} onChange={e => setUser({ ...user, first_name: e.target.value })} className="bg-white" /></div>
                                        <div className="space-y-2"><Label>Last Name</Label><Input value={user.last_name} onChange={e => setUser({ ...user, last_name: e.target.value })} className="bg-white" /></div>
                                        <div className="space-y-2"><Label>Email</Label><Input value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} className="bg-white" /></div>
                                        <div className="space-y-2"><Label>Mobile Number</Label><Input value={user.mobile} onChange={e => setUser({ ...user, mobile: e.target.value })} className="bg-white" /></div>
                                    </div>
                                    <div className="space-y-2"><Label>Bio</Label><Textarea value={user.bio} onChange={e => setUser({ ...user, bio: e.target.value })} className="h-32 bg-white resize-none" /></div>
                                    <div className="space-y-2"><Label>Address</Label><Input value={user.address} onChange={e => setUser({ ...user, address: e.target.value })} className="bg-white" /></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2"><Label>Country</Label><Input value={user.country} onChange={e => setUser({ ...user, country: e.target.value })} className="bg-white" /></div>
                                        <div className="space-y-2"><Label>State</Label><Input value={user.state} onChange={e => setUser({ ...user, state: e.target.value })} className="bg-white" /></div>
                                        <div className="space-y-2"><Label>City</Label><Input value={user.city} onChange={e => setUser({ ...user, city: e.target.value })} className="bg-white" /></div>
                                        <div className="space-y-2"><Label>Pincode</Label><Input value={user.pincode} onChange={e => setUser({ ...user, pincode: e.target.value })} className="bg-white" /></div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Languages</Label>
                                        <div className="flex gap-2">
                                            <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add language..." className="max-w-[200px]" />
                                            <Button onClick={addLanguage} type="button" variant="outline">Add</Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {user.languages && user.languages.map(tag => (
                                                <div key={tag} className="bg-[#D3043C] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                    {tag}
                                                    <button onClick={() => removeLanguage(tag)}><X className="w-3 h-3" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <Button onClick={handleProfileUpdate} className="bg-[#D3043C] hover:bg-[#a0032e] text-white">Submit</Button>
                                </div>
                            </>
                        )}

                        {activeTab === 'Security' && (
                            <>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                                    <div className="space-y-2">
                                        <Label>Current Password</Label>
                                        <Input type="password" value={passwords.current_password} onChange={e => setPasswords({ ...passwords, current_password: e.target.value })} required className="bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input type="password" value={passwords.new_password} onChange={e => setPasswords({ ...passwords, new_password: e.target.value })} required className="bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm New Password</Label>
                                        <Input type="password" value={passwords.confirm_password} onChange={e => setPasswords({ ...passwords, confirm_password: e.target.value })} required className="bg-white" />
                                    </div>
                                    <Button type="submit" className="bg-[#D3043C] hover:bg-[#a0032e] text-white w-full">Update Password</Button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfile;
