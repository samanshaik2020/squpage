// Simple test script to verify AI generation API
async function testAIGeneration() {
  try {
    console.log("Testing AI generation API...");
    
    const response = await fetch("/api/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        productName: "EcoClean Pro - Revolutionary eco-friendly cleaning solution" 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Generated Content:", data);
    
    return data;
  } catch (error) {
    console.error("Error testing AI generation:", error);
    return null;
  }
}

// Run the test
testAIGeneration();