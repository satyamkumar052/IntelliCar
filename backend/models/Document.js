import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
        docType: {
            type: String,
            required: true,
            enum: [
                "RC",
                "Insurance",
                "PUC",
                "License",
                "RoadTax",
                "Challan",
                "PurchaseInvoice",
                "ServiceRecord",
                "Warranty",
                "Other",
            ],
        },
        fileUrl: { type: String, required: true }, // Cloudinary URL
        issueDate: { type: Date },
        expiryDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ["valid", "expiring_soon", "expired"],
            default: "valid",
        },
        extractedText: { type: String }, // from OCR
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

documentSchema.virtual("daysUntilExpiry").get(function () {
    if (!this.expiryDate) return null;
    const now = new Date();
    const diffTime = this.expiryDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

documentSchema.index({ user: 1, car: 1 });
documentSchema.index({ expiryDate: 1 }); // For cron jobs seeking expiring docs

export default mongoose.model("Document", documentSchema);
