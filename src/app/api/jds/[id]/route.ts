import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import JobDescription from '@/models/JobDescription';
import getCurrentUser from '@/lib/auth'; // Assuming default import is now correct

// Define the shape of the dynamic parameters
interface DynamicRouteParams {
    params: {
        id: string;
    };
}

// --- PUT: Update a specific JD by ID ---
export async function PUT(request: NextRequest, { params }: DynamicRouteParams) {
    try {
        await dbConnect();
        
        const userId = await getCurrentUser();
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();

        // Find the JD and ensure the current user owns it (security check)
        const updatedJD = await JobDescription.findOneAndUpdate(
            { _id: id, hrId: userId._id }, 
            body, 
            { new: true, runValidators: true } // Return the new document and enforce schema rules
        );

        if (!updatedJD) {
            // JD not found OR User does not own the JD
            return NextResponse.json({ success: false, error: 'Job Description not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedJD }, { status: 200 });

    } catch (error: any) {
        console.error('API Error (PUT JD):', error);
        return NextResponse.json(
            { success: false, error: `Failed to update job description: ${error.message}` },
            { status: 500 }
        );
    }
}

// --- DELETE: Delete a specific JD by ID ---
export async function DELETE(request: NextRequest, { params }: DynamicRouteParams) {
    try {
        await dbConnect();

        const userId = await getCurrentUser();
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        // Find and delete the JD, ensuring the current user owns it (security check)
        const deletedJD = await JobDescription.findOneAndDelete({ 
            _id: id, 
            hrId: userId._id 
        });

        if (!deletedJD) {
            // JD not found OR User does not own the JD
            return NextResponse.json({ success: false, error: 'Job Description not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });

    } catch (error: any) {
        console.error('API Error (DELETE JD):', error);
        return NextResponse.json(
            { success: false, error: `Failed to delete job description: ${error.message}` },
            { status: 500 }
        );
    }
}