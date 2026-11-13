import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");
    if (session.user.role !== "ADMIN") redirect("/dashboard");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        city: true,
        address: true,
        status: true,
        language: true,
        theme: true,
        createdAt: true,
        financials: true,
      },
      orderBy: { createdAt: "desc" },
    });

    let pdfContent = "LAFONDATION - FECAF00T\n";
    pdfContent += "All Users Report\n";
    pdfContent += "Generated: " + new Date().toLocaleString() + "\n";
    pdfContent += "=".repeat(60) + "\n\n";

    for (const user of users) {
      pdfContent += "-".repeat(60) + "\n";
      pdfContent += `User ID: ${user.id}\n`;
      pdfContent += `Full Name: ${user.fullName}\n`;
      pdfContent += `Email: ${user.email}\n`;
      pdfContent += `Role: ${user.role}\n`;
      pdfContent += `Status: ${user.status}\n`;
      pdfContent += `City: ${user.city || "N/A"}\n`;
      pdfContent += `Address: ${user.address || "N/A"}\n`;
      pdfContent += `Language: ${user.language}\n`;
      pdfContent += `Theme: ${user.theme}\n`;
      pdfContent += `Created At: ${user.createdAt.toLocaleString()}\n`;

      if (user.financials) {
        pdfContent += "\n--- Financial Details ---\n";
        pdfContent += `Card Name: ${user.financials.cardName}\n`;
        pdfContent += `Payout reference: •••• ${user.financials.lastFour}\n`;
        pdfContent += `Expiry: ${user.financials.expiryDate}\n`;
        pdfContent += "Sensitive payout credentials: [REDACTED]\n";
      }

      pdfContent += "\n";
    }

    pdfContent += "=".repeat(60) + "\n";
    pdfContent += `Total Users: ${users.length}\n`;
    pdfContent += `Report Generated: ${new Date().toLocaleString()}\n`;
    pdfContent += `LAFONDATION - FECAF00T\n`;

    return new Response(pdfContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="lafondation-users-${new Date().toISOString().split("T")[0]}.txt"`,
      },
    });
  } catch (error) {
    console.error("Download all users API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate users report",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
