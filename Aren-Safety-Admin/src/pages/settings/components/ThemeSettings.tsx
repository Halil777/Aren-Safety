import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Button,
  Space,
  ColorPicker,
  Input,
  Divider,
  message,
  Radio,
  Alert,
  Row,
  Col,
} from 'antd';
import { Palette, Eye, RotateCcw, Save, Monitor } from 'lucide-react';
import { themePresets } from '@/shared/config/themePresets';
import { useThemeStore } from '@/shared/stores/theme-store';
import type { CustomThemeConfig } from '@/shared/types/theme';
import type { Color } from 'antd/es/color-picker';

export const ThemeSettings: React.FC = () => {
  const { activeTheme, applyPreset, setCustomTheme } = useThemeStore();
  const [selectedPreset, setSelectedPreset] = useState('light');
  const [customColors, setCustomColors] = useState(activeTheme.colors);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Sync with active theme
  useEffect(() => {
    setCustomColors(activeTheme.colors);
  }, [activeTheme]);

  const handlePresetChange = (presetId: string) => {
    const preset = themePresets.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      setCustomColors(preset.config.colors);
      setIsCustomizing(false);
      applyPreset(presetId);
      message.success(`Theme changed to ${preset.name}`);
    }
  };

  const handleColorChange = (key: keyof typeof customColors, color: Color) => {
    setCustomColors({
      ...customColors,
      [key]: color.toHexString(),
    });
    setIsCustomizing(true);
  };

  const handleSaveTheme = () => {
    // Create custom theme config
    const customTheme: CustomThemeConfig = {
      ...activeTheme,
      mode: 'custom',
      name: 'Custom Theme',
      colors: customColors,
    };

    // Save to theme store
    setCustomTheme(customTheme);
    message.success('Custom theme saved successfully!');
    setIsCustomizing(false);
  };

  const handleResetTheme = () => {
    const preset = themePresets.find((p) => p.id === selectedPreset);
    if (preset) {
      setCustomColors(preset.config.colors);
      applyPreset(selectedPreset);
      setIsCustomizing(false);
      message.info('Theme reset to preset defaults');
    }
  };

  const ColorPickerRow = ({ label, colorKey, description }: { label: string; colorKey: keyof typeof customColors; description?: string }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>{label}</div>
          {description && (
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{description}</div>
          )}
        </div>
        <Space>
          <ColorPicker
            value={customColors[colorKey]}
            onChange={(color) => handleColorChange(colorKey, color)}
            showText
          />
          <Input
            value={customColors[colorKey]}
            onChange={(e) =>
              setCustomColors({ ...customColors, [colorKey]: e.target.value })
            }
            style={{ width: '120px' }}
            placeholder="#000000"
          />
        </Space>
      </div>
    </div>
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Information Alert */}
      {isCustomizing && (
        <Alert
          message="Unsaved Changes"
          description="You have customized the theme. Don't forget to save your changes!"
          type="warning"
          showIcon
          action={
            <Space>
              <Button size="small" type="primary" onClick={handleSaveTheme}>
                Save
              </Button>
              <Button size="small" onClick={handleResetTheme}>
                Reset
              </Button>
            </Space>
          }
        />
      )}

      {/* Theme Presets */}
      <Card
        title={
          <Space>
            <Palette size={18} />
            Theme Presets
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <p style={{ margin: 0, color: '#8c8c8c' }}>
            Choose from professionally designed themes or customize your own
          </p>

          <Radio.Group
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            style={{ width: '100%' }}
          >
            <Row gutter={[16, 16]}>
              {themePresets.map((preset) => (
                <Col key={preset.id} xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    onClick={() => handlePresetChange(preset.id)}
                    style={{
                      border: selectedPreset === preset.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      cursor: 'pointer',
                    }}
                  >
                    <Radio value={preset.id} style={{ marginBottom: '12px' }}>
                      <strong>{preset.name}</strong>
                    </Radio>
                    <p style={{ fontSize: '12px', color: '#8c8c8c', margin: '8px 0' }}>
                      {preset.description}
                    </p>
                    {/* Color Preview */}
                    <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          background: preset.config.colors.primary,
                          borderRadius: '4px',
                        }}
                      />
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          background: preset.config.colors.accent,
                          borderRadius: '4px',
                        }}
                      />
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          background: preset.config.colors.sidebarBackground,
                          borderRadius: '4px',
                        }}
                      />
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          background: preset.config.colors.background,
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Space>
      </Card>

      {/* Theme Customization */}
      <Card
        title={
          <Space>
            <Monitor size={18} />
            Customize Theme
          </Space>
        }
      >
        <Tabs
          defaultActiveKey="primary"
          items={[
            {
              key: 'primary',
              label: 'Primary Colors',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <ColorPickerRow
                    label="Primary Color"
                    colorKey="primary"
                    description="Main brand color used for buttons and interactive elements"
                  />
                  <ColorPickerRow
                    label="Primary Hover"
                    colorKey="primaryHover"
                    description="Color when hovering over primary elements"
                  />
                  <ColorPickerRow
                    label="Accent Color"
                    colorKey="accent"
                    description="Secondary color for highlights and accents"
                  />
                </Space>
              ),
            },
            {
              key: 'background',
              label: 'Backgrounds',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <ColorPickerRow
                    label="Main Background"
                    colorKey="background"
                    description="Primary background color of the app"
                  />
                  <ColorPickerRow
                    label="Secondary Background"
                    colorKey="backgroundSecondary"
                    description="Background for cards and panels"
                  />
                  <ColorPickerRow
                    label="Tertiary Background"
                    colorKey="backgroundTertiary"
                    description="Alternative background for sections"
                  />
                </Space>
              ),
            },
            {
              key: 'sidebar',
              label: 'Sidebar',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <ColorPickerRow
                    label="Sidebar Background"
                    colorKey="sidebarBackground"
                    description="Background color of the sidebar"
                  />
                  <ColorPickerRow
                    label="Sidebar Text"
                    colorKey="sidebarText"
                    description="Text color in sidebar menu"
                  />
                  <ColorPickerRow
                    label="Sidebar Text Hover"
                    colorKey="sidebarTextHover"
                    description="Text color when hovering menu items"
                  />
                  <ColorPickerRow
                    label="Sidebar Text Active"
                    colorKey="sidebarTextActive"
                    description="Text color for active menu item"
                  />
                  <ColorPickerRow
                    label="Sidebar Item Hover"
                    colorKey="sidebarItemHover"
                    description="Background color when hovering menu items"
                  />
                  <ColorPickerRow
                    label="Sidebar Border"
                    colorKey="sidebarBorder"
                    description="Border color of sidebar"
                  />
                </Space>
              ),
            },
            {
              key: 'header',
              label: 'Header',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <ColorPickerRow
                    label="Header Background"
                    colorKey="headerBackground"
                    description="Background color of the top header"
                  />
                  <ColorPickerRow
                    label="Header Text"
                    colorKey="headerText"
                    description="Text color in header"
                  />
                  <ColorPickerRow
                    label="Header Icon Color"
                    colorKey="headerIconColor"
                    description="Color of icons in header"
                  />
                  <ColorPickerRow
                    label="Header Border"
                    colorKey="headerBorder"
                    description="Border color below header"
                  />
                </Space>
              ),
            },
            {
              key: 'text',
              label: 'Text',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <ColorPickerRow
                    label="Primary Text"
                    colorKey="textPrimary"
                    description="Main text color throughout the app"
                  />
                  <ColorPickerRow
                    label="Secondary Text"
                    colorKey="textSecondary"
                    description="Secondary text and labels"
                  />
                  <ColorPickerRow
                    label="Tertiary Text"
                    colorKey="textTertiary"
                    description="Subtle text and hints"
                  />
                  <ColorPickerRow
                    label="Disabled Text"
                    colorKey="textDisabled"
                    description="Text for disabled elements"
                  />
                </Space>
              ),
            },
            {
              key: 'status',
              label: 'Status Colors',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <ColorPickerRow
                    label="Success"
                    colorKey="success"
                    description="Color for success messages and indicators"
                  />
                  <ColorPickerRow
                    label="Warning"
                    colorKey="warning"
                    description="Color for warnings and alerts"
                  />
                  <ColorPickerRow
                    label="Error"
                    colorKey="error"
                    description="Color for errors and critical actions"
                  />
                  <ColorPickerRow
                    label="Info"
                    colorKey="info"
                    description="Color for informational messages"
                  />
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Live Preview */}
      <Card
        title={
          <Space>
            <Eye size={18} />
            Live Preview
          </Space>
        }
      >
        <div
          style={{
            padding: '24px',
            background: customColors.background,
            borderRadius: '8px',
            border: `1px solid ${customColors.border}`,
          }}
        >
          {/* Preview Header */}
          <div
            style={{
              background: customColors.headerBackground,
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: `1px solid ${customColors.headerBorder}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, color: customColors.headerText }}>Header Preview</h3>
            <Space>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: customColors.headerIconColor,
                  borderRadius: '6px',
                }}
              />
            </Space>
          </div>

          <Row gutter={16}>
            {/* Preview Sidebar */}
            <Col span={6}>
              <div
                style={{
                  background: customColors.sidebarBackground,
                  padding: '16px',
                  borderRadius: '8px',
                  border: `1px solid ${customColors.sidebarBorder}`,
                  minHeight: '200px',
                }}
              >
                <div
                  style={{
                    color: customColors.sidebarText,
                    marginBottom: '8px',
                    padding: '8px',
                    borderRadius: '6px',
                  }}
                >
                  Menu Item
                </div>
                <div
                  style={{
                    color: customColors.sidebarTextActive,
                    background: customColors.sidebarItemActive,
                    padding: '8px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                  }}
                >
                  Active Item
                </div>
                <div
                  style={{
                    color: customColors.sidebarText,
                    padding: '8px',
                    borderRadius: '6px',
                  }}
                >
                  Menu Item
                </div>
              </div>
            </Col>

            {/* Preview Content */}
            <Col span={18}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Preview Card */}
                <div
                  style={{
                    background: customColors.cardBackground,
                    padding: '16px',
                    borderRadius: '8px',
                    border: `1px solid ${customColors.cardBorder}`,
                  }}
                >
                  <h4 style={{ margin: '0 0 8px 0', color: customColors.textPrimary }}>
                    Card Title
                  </h4>
                  <p style={{ margin: 0, color: customColors.textSecondary }}>
                    This is a preview of how cards will look with your custom theme.
                  </p>
                </div>

                {/* Preview Buttons */}
                <Space>
                  <Button
                    type="primary"
                    style={{
                      background: customColors.primary,
                      borderColor: customColors.primary,
                    }}
                  >
                    Primary Button
                  </Button>
                  <Button
                    style={{
                      color: customColors.accent,
                      borderColor: customColors.accent,
                    }}
                  >
                    Accent Button
                  </Button>
                </Space>

                {/* Preview Status */}
                <Space>
                  <div
                    style={{
                      padding: '4px 12px',
                      background: customColors.successLight,
                      color: customColors.success,
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  >
                    Success
                  </div>
                  <div
                    style={{
                      padding: '4px 12px',
                      background: customColors.warningLight,
                      color: customColors.warning,
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  >
                    Warning
                  </div>
                  <div
                    style={{
                      padding: '4px 12px',
                      background: customColors.errorLight,
                      color: customColors.error,
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  >
                    Error
                  </div>
                </Space>
              </Space>
            </Col>
          </Row>
        </div>
      </Card>

      <Divider />

      {/* Action Buttons */}
      <Space>
        <Button
          type="primary"
          size="large"
          icon={<Save size={18} />}
          onClick={handleSaveTheme}
          disabled={!isCustomizing}
          style={{ borderRadius: '6px', height: '44px' }}
        >
          Save Custom Theme
        </Button>
        <Button
          size="large"
          icon={<RotateCcw size={18} />}
          onClick={handleResetTheme}
          disabled={!isCustomizing}
          style={{ borderRadius: '6px', height: '44px' }}
        >
          Reset to Preset
        </Button>
      </Space>
    </Space>
  );
};
