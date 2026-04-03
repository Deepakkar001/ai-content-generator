// /api/create-subscription
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay'


export async function POST(req,res){
    // The client currently posts an empty body `{}`, so we parse defensively.
    // If `addons` is not provided (or is empty), we omit it.
    // Razorpay can reject empty arrays depending on how the SDK serializes them.
    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const incomingAddons = body?.addons;
    let addons;
    if (incomingAddons === undefined || incomingAddons === null) {
      addons = undefined;
    } else if (Array.isArray(incomingAddons)) {
      addons = incomingAddons;
    } else {
      // If caller provides invalid shape, fail fast with a helpful message.
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", description: "`addons` must be an array" } },
        { status: 400 }
      );
    }

    let instance = new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_SECRET_KEY
    })

    const payload = {
        plan_id:process.env.SUBSCRIPTION_PLAN_ID,
        customer_notify:1,
        quantity:1,
        total_count:1,
        notes:{
            key1:"subscription added"
        }
    };

    // Only include addons when we actually have them.
    if (Array.isArray(addons) && addons.length > 0) {
      payload.addons = addons;
    }

    const result= await instance.subscriptions.create(payload);

    return NextResponse.json(result);
}