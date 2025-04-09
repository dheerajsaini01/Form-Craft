
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useFormBuilder } from "@/contexts/FormBuilderContext";

const colorPresets = [
  "#8B5CF6", // Purple
  "#D946EF", // Pink
  "#F97316", // Orange
  "#3B82F6", // Blue
  "#10B981", // Green
  "#EC4899", // Pink
  "#EF4444", // Red
  "#6366F1", // Indigo
];

const fontOptions = [
  "Inter, sans-serif",
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Georgia, serif",
  "Verdana, sans-serif",
  "Tahoma, sans-serif",
  "Trebuchet MS, sans-serif",
  "Times New Roman, serif",
];

export function FormStyleEditor() {
  const { currentForm, updateFormStyle } = useFormBuilder();
  const [style, setStyle] = useState(currentForm?.style);
  
  useEffect(() => {
    if (currentForm) {
      setStyle(currentForm.style);
    }
  }, [currentForm]);
  
  if (!style) return null;

  const handleStyleChange = (updatedStyle: any) => {
    setStyle({ ...style, ...updatedStyle });
    updateFormStyle(updatedStyle);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Style</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="colors">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-6">
            <div className="space-y-3">
              <Label className="block mb-2">Primary Color</Label>
              <div className="grid grid-cols-4 gap-3">
                {colorPresets.map((color) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded-full cursor-pointer border border-gray-200 transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    onClick={() => handleStyleChange({ primaryColor: color })}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-3 mt-3">
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: style.primaryColor }}
                />
                <Input
                  type="text"
                  value={style.primaryColor}
                  onChange={(e) => handleStyleChange({ primaryColor: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <Label className="block mb-2">Background Color</Label>
              <div className="grid grid-cols-4 gap-3">
                {["#FFFFFF", "#F3F4F6", "#F9FAFB", "#F1F5F9"].map((color) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded-full cursor-pointer border border-gray-200 transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    onClick={() => handleStyleChange({ backgroundColor: color })}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-3 mt-3">
                <div
                  className="w-8 h-8 rounded-full border border-gray-200"
                  style={{ backgroundColor: style.backgroundColor }}
                />
                <Input
                  type="text"
                  value={style.backgroundColor}
                  onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-6">
            <div className="space-y-4">
              <Label className="block mb-2">Font Family</Label>
              <div className="grid grid-cols-1 gap-2">
                {fontOptions.map((font) => (
                  <Button
                    key={font}
                    variant={style.fontFamily === font ? "default" : "outline"}
                    className="justify-start h-auto py-2 px-3 w-full text-left"
                    style={{ fontFamily: font }}
                    onClick={() => handleStyleChange({ fontFamily: font })}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium truncate">
                        {font.split(",")[0]}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        The quick brown fox jumps over the lazy dog
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-6 pt-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <Label>Border Radius</Label>
                <span className="text-sm text-muted-foreground">{style.borderRadius}px</span>
              </div>
              <Slider
                value={[style.borderRadius]}
                min={0}
                max={20}
                step={1}
                onValueChange={(value) => handleStyleChange({ borderRadius: value[0] })}
              />
              <div className="flex items-center justify-center mt-6">
                <div 
                  className="w-40 h-16 border-2 flex items-center justify-center"
                  style={{ 
                    borderRadius: `${style.borderRadius}px`, 
                    borderColor: style.primaryColor,
                    backgroundColor: style.backgroundColor
                  }}
                >
                  <span style={{ color: style.primaryColor, fontFamily: style.fontFamily }}>
                    Preview
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
