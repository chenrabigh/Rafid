import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
function verifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware to check if user is admin
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if ((req as any).user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

/* AUTH */
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, role, companyId } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({ error: "email, password, and role are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        companyId: companyId || null,
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, companyId: user.companyId },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.company?.name || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* COMPANIES */
app.post("/api/companies", async (req, res) => {
  try {
    const { name, industry, city } = req.body;

    if (!name || !industry || !city) {
      return res.status(400).json({ error: "name, industry, and city are required" });
    }

    const company = await prisma.company.create({
      data: {
        name,
        industry,
        city,
      },
    });

    res.status(201).json(company);
  } catch (error) {
    console.error("Create company error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/companies", async (_req, res) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(companies);
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.patch("/api/companies/:id/verify", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    if (typeof verified !== "boolean") {
      res.status(400).json({ error: "verified must be true or false" });
      return;
    }

    const company = await prisma.company.update({
      where: { id },
      data: { verified },
    });

    res.json(company);
  } catch (error) {
    console.error("Update company verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* LISTINGS */
app.post("/api/listings", async (req, res) => {
  try {
    const {
      companyId,
      companyName,
      material,
      grade,
      purity,
      quantity,
      unit,
      frequency,
      description,
      compliance,
      location,
    } = req.body;

    if (!companyName || !material || !quantity || !unit || !description || !location) {
      res.status(400).json({
        error: "companyName, material, quantity, unit, description, and location are required",
      });
      return;
    }

    const listing = await prisma.listing.create({
      data: {
        companyId,
        companyName,
        material,
        grade: grade || null,
        purity: purity || null,
        quantity: Number(quantity),
        unit,
        frequency: frequency || "One-time",
        description,
        compliance: compliance || "Pending review",
        location,
      },
      include: {
        company: true,
      },
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/listings", async (_req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(listings);
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/listings/:id/verify", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    if (typeof verified !== "boolean") {
      res.status(400).json({ error: "verified must be true or false" });
      return;
    }

    const listing = await prisma.listing.update({
      where: { id },
      data: { verified },
      include: { company: true },
    });

    res.json(listing);
  } catch (error) {
    console.error("Update listing verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* DEAL REQUESTS */
app.post("/api/requests", verifyToken, async (req, res) => {
  try {
    const { listingId, buyerCompanyName, location, material, unit, quantity, price } = req.body;
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!quantity || !price || !buyerCompanyName || !location) {
      return res.status(400).json({
        error: "quantity, price, buyerCompanyName and location are required",
      });
    }

    if (!listingId && (!material || !unit)) {
      return res.status(400).json({
        error: "Either listingId or material and unit are required",
      });
    }

    if (listingId) {
      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing) {
        return res.status(404).json({ error: "Supply listing not found" });
      }
    }

    let buyerId = user.companyId;
    let buyerCompany = buyerId
      ? await prisma.company.findUnique({ where: { id: buyerId } })
      : null;

    if (!buyerCompany) {
      buyerCompany = await prisma.company.create({
        data: {
          name: buyerCompanyName,
          industry: "Unknown",
          city: location,
          verified: false,
        },
      });
      buyerId = buyerCompany.id;

      if (user.id) {
        await prisma.user.update({
          where: { id: user.userId ?? user.id },
          data: { companyId: buyerId },
        });
      }
    } else if (location) {
      await prisma.company.update({
        where: { id: buyerCompany.id },
        data: { city: location },
      });
      buyerCompany.city = location;
    }

    const request = await prisma.dealRequest.create({
      data: {
        listingId: listingId || null,
        buyerId: buyerId!,
        buyerCompanyName,
        material: material || null,
        unit: unit || null,
        quantity: Number(quantity),
        price: Number(price),
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("Create request error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.get("/api/requests", async (_req, res) => {
  try {
    const requests = await prisma.dealRequest.findMany({
      include: {
        listing: true,
        buyer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(requests);
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* IMPACT */
app.get("/api/impact", async (_req, res) => {
  try {
    const impact = await prisma.impact.findMany({
      orderBy: { id: "desc" },
    });

    res.json(impact);
  } catch (error) {
    console.error("Get impact error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/matches", async (req, res) => {
  try {
    const type = String(req.query.type || "");
    const id = String(req.query.id || "");

    if (!type || !id) {
      res.status(400).json({ error: "type and id are required" });
      return;
    }

    if (type === "listing") {
      const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
          company: true,
        },
      });

      if (!listing) {
        res.status(404).json({ error: "Listing not found" });
        return;
      }

      const requests = await prisma.dealRequest.findMany({
        include: {
          listing: true,
          buyer: true,
        },
      });

      const matches = requests
      .flatMap((request) => {
        if (!request.buyer) {
          return [];
        }

        const requestMaterial = (request.listing?.material || request.material || "").toLowerCase();
        const listingMaterial = listing.material.toLowerCase();

        if (requestMaterial !== listingMaterial) {
          return [];
        }

        if (request.quantity > listing.quantity) {
          return [];
        }

        let score = 0;
        const reasons: string[] = [];

        score += 40;
        reasons.push('Material match');

        const quantityRatio = Math.min(request.quantity / listing.quantity, 1);
        const quantityScore = Math.round(quantityRatio * 30);
        score += quantityScore;
        reasons.push(`Quantity match: ${Math.round(quantityRatio * 100)}%`);

        if (request.buyer.city && listing.company?.city && request.buyer.city === listing.company.city) {
          score += 15;
          reasons.push('Same city delivery');
        } else {
          score += 5;
          reasons.push('Long-distance option');
        }

        if (request.buyer.verified) {
          score += 8;
          reasons.push('Verified buyer');
        }
        if (listing.company?.verified) {
          score += 7;
          reasons.push('Verified supplier');
        }

        if (request.price > 0) {
          score += 5;
          reasons.push('Price provided');
        }

        score = Math.min(score, 100);

        return {
          id: request.id,
          matchType: 'request',
          score,
          breakdown: {
            fit: 40,
            quantity: quantityScore,
            distance: request.buyer.city === listing.company?.city ? 15 : 5,
            trust: (request.buyer.verified ? 8 : 0) + (listing.company?.verified ? 7 : 0),
            economics: request.price > 0 ? 5 : 0,
          },
          reasons,
          data: request,
        };
      })
        .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.score - a.score);

      res.json(matches);
      return;
    }

    if (type === "request") {
      const request = await prisma.dealRequest.findUnique({
        where: { id },
        include: {
          listing: true,
          buyer: true,
        },
      });

      if (!request) {
        res.status(404).json({ error: "Request not found" });
        return;
      }

      const listings = await prisma.listing.findMany({
        include: {
          company: true,
        },
      });

      const matches = listings
        .map((listing) => {
          let score = 0;
          const reasons: string[] = [];

          const requestMaterial = (request.listing?.material || request.material || "").toLowerCase();
          const listingMaterial = listing.material.toLowerCase();

          if (requestMaterial !== listingMaterial) {
            return null;
          }
          
          if (request.quantity > listing.quantity) {
            return null;
          }

          score += 40;
          reasons.push('Material match');

          const quantityRatio = Math.min(request.quantity / listing.quantity, 1);
          const quantityScore = Math.round(quantityRatio * 30);
          score += quantityScore;
          reasons.push(`Quantity match: ${Math.round(quantityRatio * 100)}%`);

          if (request.buyer?.city && listing.company?.city && request.buyer.city === listing.company.city) {
            score += 15;
            reasons.push('Same city delivery');
          } else {
            score += 5;
            reasons.push('Broader delivery');
          }

          if (listing.company?.verified) {
            score += 8;
            reasons.push('Verified supplier');
          }

          if (request.buyer?.verified) {
            score += 7;
            reasons.push('Verified buyer');
          }

          if (request.price > 0) {
            score += 5;
            reasons.push('Price provided');
          }

          score = Math.min(score, 100);

          return {
            id: listing.id,
            matchType: 'listing',
            score,
            breakdown: {
              fit: 40,
              quantity: quantityScore,
              distance: request.buyer?.city === listing.company?.city ? 15 : 5,
              trust: (listing.company?.verified ? 8 : 0) + (request.buyer?.verified ? 7 : 0),
              economics: request.price > 0 ? 5 : 0,
            },
            reasons,
            data: listing,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);

      res.json(matches);
      return;
    }

    res.status(400).json({ error: 'type must be "listing" or "request"' });
  } catch (error) {
    console.error("Get matches error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/impact/summary", async (_req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        company: true,
        requests: true,
      },
    });

    const requests = await prisma.dealRequest.findMany({
      include: {
        buyer: true,
        listing: true,
      },
    });

    const activeListings = listings.length;
    const matchedOpportunities = requests.length;
    const verifiedListings = listings.filter((listing) => listing.company?.verified).length;
    const acceptedRequests = requests.filter((request) => request.status === "ACCEPTED").length;

    const tonsDiverted = requests
      .filter((request) => request.status === "ACCEPTED")
      .reduce((sum, request) => sum + request.quantity, 0);

    const estimatedCO2Saved = Number((tonsDiverted * 1.8).toFixed(2));

    const acceptanceRate =
      requests.length > 0
        ? Number(((acceptedRequests / requests.length) * 100).toFixed(1))
        : 0;

    res.json({
      activeListings,
      matchedOpportunities,
      verifiedListings,
      verifiedTransactions: acceptedRequests,
      tonsDiverted,
      estimatedCO2Saved,
      acceptanceRate,
    });
  } catch (error) {
    console.error("Impact summary error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = Number(process.env.PORT) || 5000;

function getTokenFromHeader(authHeader?: string) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
}

app.get("/api/me", async (req, res) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        company: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      company: user.company,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.patch("/api/users/:id/company", async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.body;

    if (!companyId) {
      res.status(400).json({ error: "companyId is required" });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: { companyId },
    });

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });
  } catch (error) {
    console.error("Update user company error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function seedDefaultData() {
  console.log("Seeding default users and companies...");

  let supplierCompany = await prisma.company.findFirst({ where: { name: "Demo Supplier" } });
  if (!supplierCompany) {
    supplierCompany = await prisma.company.create({
      data: {
        name: "Demo Supplier",
        industry: "Plastics",
        city: "Riyadh",
        verified: true,
      },
    });
  } else {
    supplierCompany = await prisma.company.update({
      where: { id: supplierCompany.id },
      data: { industry: "Plastics", city: "Riyadh", verified: true },
    });
  }

  let buyerCompany = await prisma.company.findFirst({ where: { name: "Demo Buyer" } });
  if (!buyerCompany) {
    buyerCompany = await prisma.company.create({
      data: {
        name: "Demo Buyer",
        industry: "Manufacturing",
        city: "Jeddah",
        verified: true,
      },
    });
  } else {
    buyerCompany = await prisma.company.update({
      where: { id: buyerCompany.id },
      data: { industry: "Manufacturing", city: "Jeddah", verified: true },
    });
  }

  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.user.upsert({
    where: { email: "supplier@rafid.com" },
    update: {
      password: hashedPassword,
      role: "SUPPLIER",
      companyId: supplierCompany.id,
    },
    create: {
      email: "supplier@rafid.com",
      password: hashedPassword,
      role: "SUPPLIER",
      companyId: supplierCompany.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "buyer@rafid.com" },
    update: {
      password: hashedPassword,
      role: "BUYER",
      companyId: buyerCompany.id,
    },
    create: {
      email: "buyer@rafid.com",
      password: hashedPassword,
      role: "BUYER",
      companyId: buyerCompany.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@rafid.com" },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      companyId: null,
    },
    create: {
      email: "admin@rafid.com",
      password: hashedPassword,
      role: "ADMIN",
      companyId: null,
    },
  });

  console.log("Default users ensured: supplier@rafid.com / buyer@rafid.com / admin@rafid.com (password: password)");
}

(async () => {
  try {
    await seedDefaultData();
  } catch (error) {
    console.error("Failed to seed default data:", error);
  }

  app.listen(PORT, () => {
    console.log(`RAFID API running on http://localhost:${PORT}`);
  });
})();