import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteField } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REMOVED_SECRET",
  authDomain: "roadmate-72830.firebaseapp.com",
  projectId: "roadmate-72830",
  storageBucket: "roadmate-72830.firebasestorage.app",
  messagingSenderId: "1062661041786",
  appId: "1:1062661041786:web:5b92f1c2730472bc3755c3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateUsers() {
    console.log("🚀 Starting Database Migration...");
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    
    console.log(`📌 Found ${snapshot.size} users to process.`);
    
    for (const userDoc of snapshot.docs) {
        const data = userDoc.data();
        const userId = userDoc.id;
        
        // Skip if already migrated (has profile map)
        if (data.profile) {
            console.log(`✅ User ${userId} already migrated. Skipping.`);
            continue;
        }

        console.log(`🔄 Migrating User: ${userId} (${data.name || data.displayName || 'No Name'})`);

        const newProfile = {
            name: data.name || data.displayName || "",
            email: data.email || "",
            phone: data.phone || data.phoneNumber || "",
            bio: data.bio || "",
            birthday: data.birthday || "",
            gender: data.gender || "",
            city: data.city || "",
            address: data.address || "",
            profilePhoto: data.profilePhoto || data.photoURL || "",
            joined: data.joined || data.createdAt || null
        };

        const newVerification = {
            status: data.verificationStatus || data.aadhaarStatus || "unverified",
            aadhaar: {
                number: data.aadhaarNumber || null,
                status: data.aadhaarStatus || "unverified",
                frontImage: data.aadhaarFrontImage || null,
                backImage: data.aadhaarBackImage || null,
                submittedAt: data.aadhaarSubmittedAt || null,
                verifiedAt: data.aadhaarVerifiedAt || null,
                rejectedAt: data.aadhaarRejectedAt || null,
                rejectedReason: data.aadhaarRejectedReason || ""
            },
            drivingLicence: {
                number: data.dlNumber || null,
                status: data.dlStatus || "unverified",
                frontImage: data.dlFrontImage || null,
                backImage: data.dlBackImage || null,
                class: data.dlClass || null,
                expiry: data.dlExpiry || null,
                submittedAt: data.dlSubmittedAt || null,
                verifiedAt: data.dlVerifiedAt || null,
                rejectedAt: data.dlRejectedAt || null,
                rejectedReason: data.dlRejectedReason || ""
            },
            selfie: {
                url: data.selfieImage || null,
                status: data.selfieStatus || "unverified"
            }
        };

        // Prepare update object with map creation and root deletion
        const updateData = {
            profile: newProfile,
            verification: newVerification,
            // List of old fields to delete
            name: deleteField(),
            displayName: deleteField(),
            email: deleteField(),
            phone: deleteField(),
            phoneNumber: deleteField(),
            bio: deleteField(),
            birthday: deleteField(),
            gender: deleteField(),
            city: deleteField(),
            address: deleteField(),
            profilePhoto: deleteField(),
            photoURL: deleteField(),
            joined: deleteField(),
            createdAt: deleteField(),
            aadhaarNumber: deleteField(),
            aadhaarStatus: deleteField(),
            aadhaarFrontImage: deleteField(),
            aadhaarBackImage: deleteField(),
            aadhaarSubmittedAt: deleteField(),
            aadhaarVerifiedAt: deleteField(),
            aadhaarRejectedAt: deleteField(),
            aadhaarRejectedReason: deleteField(),
            dlNumber: deleteField(),
            dlStatus: deleteField(),
            dlFrontImage: deleteField(),
            dlBackImage: deleteField(),
            dlClass: deleteField(),
            dlExpiry: deleteField(),
            dlSubmittedAt: deleteField(),
            dlVerifiedAt: deleteField(),
            dlRejectedAt: deleteField(),
            dlRejectedReason: deleteField(),
            selfieImage: deleteField(),
            selfieStatus: deleteField(),
            verificationStatus: deleteField()
        };

        try {
            await updateDoc(doc(db, "users", userId), updateData);
            console.log(`✨ Successfully migrated ${userId}`);
        } catch (err) {
            console.error(`❌ Error migrating ${userId}:`, err);
        }
    }

    console.log("🏁 Migration Complete!");
    process.exit(0);
}

migrateUsers();
