import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ResumeParsed from '@/models/ResumeParsed';
// 💡 FIX 1: Import the DEFAULT export (which is the getCurrentUser function)
import getCurrentUser from '@/lib/auth'; 
import mongoose from 'mongoose';

// Define the shape of the dynamic parameters
interface DynamicRouteParams {
    params: {
        resumeId: string;
    };
}

// --- DELETE: Delete a specific Resume by ID ---
export async function DELETE(request: NextRequest, { params }: DynamicRouteParams) {
    try {
        await dbConnect();
        
        // 💡 FIX 2: Call the function directly using the default import name.
        // NOTE: We also removed the unnecessary 'req' parameter from the call.
        const currentUser = await getCurrentUser(); 
        
        if (!currentUser || currentUser.role !== 'hr') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { resumeId } = params;

        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
             return NextResponse.json({ success: false, error: 'Invalid resume ID format.' }, { status: 400 });
        }

        // Find and delete the Resume, ensuring the current HR user owns it (security check)
        const deletedResume = await ResumeParsed.findOneAndDelete({ 
            _id: resumeId, 
            uploadedBy: currentUser._id 
        });

        if (!deletedResume) {
            // Resume not found OR User does not own the resume
            return NextResponse.json({ success: false, error: 'Resume not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });

    } catch (error: any) {
        console.error('Delete Error:', error);
        return NextResponse.json(
            { success: false, error: `Failed to delete resume: ${error.message}` },
            { status: 500 }
        );
    }
}

// NOTE: Add a GET handler here if needed, following the same correct import pattern.
export async function PUT(request: NextRequest, { params }: DynamicRouteParams) {
    try {
        await dbConnect();
        
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser._id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { resumeId } = params;

        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
             return NextResponse.json({ success: false, error: 'Invalid resume ID format.' }, { status: 400 });
        }
        
        const updateData = await request.json();

        // 💡 Find and update the JD, ensuring the current user owns it (security check)
        const updatedResume = await ResumeParsed.findOneAndUpdate(
            { _id: resumeId, uploadedBy: currentUser._id }, // Filter by ID and Owner
            updateData, 
            { new: true, runValidators: true } // Return the new document and enforce schema rules
        );

        if (!updatedResume) {
            return NextResponse.json({ success: false, error: 'Resume not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedResume }, { status: 200 });

    } catch (error: any) {
        console.error('API Error (PUT Resume):', error);
        // Handle validation errors from Mongoose
        const errorMessage = error.message.includes('validation failed') 
            ? `Validation Failed: ${error.message}` 
            : `Failed to update resume: ${error.message}`;

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}