### 获取地址
curl --request GET \
  --url https://openrouter.ai/api/v1/models \
  --header 'Authorization: Bearer <token>'

### 返回的大模型价格json
```json
{
    "data": [
        {
            "id": "xiaomi/mimo-v2.5",
            "canonical_slug": "xiaomi/mimo-v2.5-20260422",
            "hugging_face_id": "XiaomiMiMo/MiMo-V2.5",
            "name": "Xiaomi: MiMo-V2.5",
            "created": 1776874269,
            "description": "MiMo-V2.5 is a native omnimodal model by Xiaomi. It delivers Pro-level agentic performance at roughly half the inference cost, while surpassing MiMo-V2-Omni in multimodal perception across image and video understanding...",
            "context_length": 1048576,
            "architecture": {
                "modality": "text+image+audio+video->text",
                "input_modalities": [
                    "text",
                    "audio",
                    "image",
                    "video"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Other",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.000000105",
                "completion": "0.00000028",
                "input_cache_read": "0.000000028"
            },
            "top_provider": {
                "context_length": 32000,
                "max_completion_tokens": null,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "logit_bias",
                "logprobs",
                "max_tokens",
                "min_p",
                "presence_penalty",
                "reasoning",
                "repetition_penalty",
                "response_format",
                "seed",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_logprobs",
                "top_p"
            ],
            "default_parameters": {
                "temperature": 1,
                "top_p": 0.95,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/xiaomi/mimo-v2.5-20260422/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1292,
                        "win_rate": 53.2,
                        "rank": 20
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1185,
                        "win_rate": 47,
                        "rank": 31
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1298,
                        "win_rate": 54.8,
                        "rank": 16
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1281,
                        "win_rate": 54.2,
                        "rank": 18
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1298,
                        "win_rate": 55.6,
                        "rank": 17
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1222,
                        "win_rate": 52.6,
                        "rank": 22
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1310,
                        "win_rate": 56,
                        "rank": 13
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1300,
                        "win_rate": 55.1,
                        "rank": 13
                    }
                ]
            },
            "reasoning": {
                "mandatory": false
            }
        },
        {
            "id": "minimax/minimax-m3",
            "canonical_slug": "minimax/minimax-m3-20260531",
            "hugging_face_id": "MiniMaxAI/Minimax-M3",
            "name": "MiniMax: MiniMax M3",
            "created": 1780245374,
            "description": "MiniMax-M3 is a multimodal foundation model from MiniMax. It supports text, image, and video inputs with text output, a 1M-token context window, and is suited for long-horizon agentic work, coding,...",
            "context_length": 1048576,
            "architecture": {
                "modality": "text+image+video->text",
                "input_modalities": [
                    "text",
                    "image",
                    "video"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Other",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.0000003",
                "completion": "0.0000012",
                "input_cache_read": "0.00000006"
            },
            "top_provider": {
                "context_length": 524288,
                "max_completion_tokens": 512000,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "logit_bias",
                "logprobs",
                "max_tokens",
                "min_p",
                "presence_penalty",
                "reasoning",
                "repetition_penalty",
                "response_format",
                "seed",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_logprobs",
                "top_p"
            ],
            "default_parameters": {
                "temperature": 1,
                "top_p": 0.95,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/minimax/minimax-m3-20260531/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "agents",
                        "category": "androidnative",
                        "elo": 1061,
                        "win_rate": 27.2,
                        "rank": 24
                    },
                    {
                        "arena": "agents",
                        "category": "fullstack",
                        "elo": 1236,
                        "win_rate": 54.8,
                        "rank": 9
                    },
                    {
                        "arena": "agents",
                        "category": "mobileapps",
                        "elo": 1284,
                        "win_rate": 59.4,
                        "rank": 1
                    },
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1301,
                        "win_rate": 56.3,
                        "rank": 19
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1217,
                        "win_rate": 49.5,
                        "rank": 15
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1301,
                        "win_rate": 55.6,
                        "rank": 15
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1287,
                        "win_rate": 56.4,
                        "rank": 13
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1288,
                        "win_rate": 51.7,
                        "rank": 20
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1243,
                        "win_rate": 54.4,
                        "rank": 16
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1293,
                        "win_rate": 54,
                        "rank": 18
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1300,
                        "win_rate": 55.6,
                        "rank": 14
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 44.4,
                    "coding_index": 58.6,
                    "agentic_index": 35.4
                }
            },
            "reasoning": {
                "mandatory": false
            }
        },
        {
            "id": "z-ai/glm-5.2",
            "canonical_slug": "z-ai/glm-5.2-20260616",
            "hugging_face_id": "zai-org/GLM-5.2",
            "name": "Z.ai: GLM 5.2",
            "created": 1781631930,
            "description": "GLM 5.2 is a large-scale reasoning model from Z.ai. It supports text input and output with a 1M-token context window, and is suited for long-horizon agent workflows, project-level software engineering,...",
            "context_length": 1048576,
            "architecture": {
                "modality": "text->text",
                "input_modalities": [
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Other",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.00000056",
                "completion": "0.00000176",
                "input_cache_read": "0.000000104"
            },
            "top_provider": {
                "context_length": 1048576,
                "max_completion_tokens": 131072,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "logit_bias",
                "logprobs",
                "max_tokens",
                "min_p",
                "parallel_tool_calls",
                "presence_penalty",
                "reasoning",
                "reasoning_effort",
                "repetition_penalty",
                "response_format",
                "seed",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_logprobs",
                "top_p"
            ],
            "default_parameters": {
                "temperature": 1,
                "top_p": 0.95,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/z-ai/glm-5.2-20260616/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "agents",
                        "category": "androidnative",
                        "elo": 1253,
                        "win_rate": 57.1,
                        "rank": 6
                    },
                    {
                        "arena": "agents",
                        "category": "fullstack",
                        "elo": 1288,
                        "win_rate": 63.2,
                        "rank": 3
                    },
                    {
                        "arena": "agents",
                        "category": "htmlslides",
                        "elo": 1203,
                        "win_rate": 52.3,
                        "rank": 8
                    },
                    {
                        "arena": "agents",
                        "category": "mobileapps",
                        "elo": 1237,
                        "win_rate": 53.8,
                        "rank": 6
                    },
                    {
                        "arena": "agents",
                        "category": "python-pptxslides",
                        "elo": 1219,
                        "win_rate": 50.3,
                        "rank": 5
                    },
                    {
                        "arena": "agents",
                        "category": "webapps",
                        "elo": 1284,
                        "win_rate": 57.5,
                        "rank": 3
                    },
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1377,
                        "win_rate": 62.8,
                        "rank": 1
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1356,
                        "win_rate": 61.8,
                        "rank": 1
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1326,
                        "win_rate": 60,
                        "rank": 4
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1357,
                        "win_rate": 61.3,
                        "rank": 2
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1339,
                        "win_rate": 59.9,
                        "rank": 4
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1351,
                        "win_rate": 61.5,
                        "rank": 1
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 51.1,
                    "coding_index": 68.8,
                    "agentic_index": 43.1
                }
            },
            "reasoning": {
                "mandatory": false,
                "default_enabled": true,
                "supported_efforts": [
                    "xhigh",
                    "high"
                ],
                "default_effort": "high"
            }
        },
        {
            "id": "deepseek/deepseek-v4-pro",
            "canonical_slug": "deepseek/deepseek-v4-pro-20260423",
            "hugging_face_id": "deepseek-ai/DeepSeek-V4-Pro",
            "name": "DeepSeek: DeepSeek V4 Pro",
            "created": 1777000679,
            "description": "DeepSeek V4 Pro is a large-scale Mixture-of-Experts model from DeepSeek with 1.6T total parameters and 49B activated parameters, supporting a 1M-token context window. It is designed for advanced reasoning, coding,...",
            "context_length": 1048576,
            "architecture": {
                "modality": "text->text",
                "input_modalities": [
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "DeepSeek",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.000000435",
                "completion": "0.00000087",
                "input_cache_read": "0.000000003625"
            },
            "top_provider": {
                "context_length": 1048576,
                "max_completion_tokens": 384000,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "logit_bias",
                "logprobs",
                "max_tokens",
                "min_p",
                "presence_penalty",
                "reasoning",
                "repetition_penalty",
                "response_format",
                "seed",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_logprobs",
                "top_p"
            ],
            "default_parameters": {
                "temperature": 1,
                "top_p": 1,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/deepseek/deepseek-v4-pro-20260423/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "agents",
                        "category": "fullstack",
                        "elo": 948,
                        "win_rate": 22.1,
                        "rank": 31
                    },
                    {
                        "arena": "agents",
                        "category": "godotgamedev",
                        "elo": 1098,
                        "win_rate": 34,
                        "rank": 20
                    },
                    {
                        "arena": "agents",
                        "category": "webapps",
                        "elo": 1019,
                        "win_rate": 26.6,
                        "rank": 25
                    },
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1329,
                        "win_rate": 59.6,
                        "rank": 7
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1202,
                        "win_rate": 47.5,
                        "rank": 21
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1285,
                        "win_rate": 54.8,
                        "rank": 21
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1219,
                        "win_rate": 48.4,
                        "rank": 39
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1296,
                        "win_rate": 56.2,
                        "rank": 18
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1190,
                        "win_rate": 46.6,
                        "rank": 35
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1272,
                        "win_rate": 52.1,
                        "rank": 25
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1275,
                        "win_rate": 53.6,
                        "rank": 24
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 44.3,
                    "coding_index": 59.4,
                    "agentic_index": 36.4
                }
            },
            "reasoning": {
                "mandatory": false,
                "supported_efforts": [
                    "xhigh",
                    "high"
                ],
                "default_effort": "high"
            }
        },
        {
            "id": "deepseek/deepseek-v4-flash",
            "canonical_slug": "deepseek/deepseek-v4-flash-20260423",
            "hugging_face_id": "deepseek-ai/DeepSeek-V4-Flash",
            "name": "DeepSeek: DeepSeek V4 Flash",
            "created": 1777000666,
            "description": "DeepSeek V4 Flash is an efficiency-optimized Mixture-of-Experts model from DeepSeek with 284B total parameters and 13B activated parameters, supporting a 1M-token context window. It is designed for fast inference and...",
            "context_length": 1048576,
            "architecture": {
                "modality": "text->text",
                "input_modalities": [
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "DeepSeek",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.00000009",
                "completion": "0.00000018",
                "input_cache_read": "0.000000018"
            },
            "top_provider": {
                "context_length": 1048576,
                "max_completion_tokens": 65536,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "logit_bias",
                "logprobs",
                "max_tokens",
                "min_p",
                "presence_penalty",
                "reasoning",
                "repetition_penalty",
                "response_format",
                "seed",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_logprobs",
                "top_p"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/deepseek/deepseek-v4-flash-20260423/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1266,
                        "win_rate": 50,
                        "rank": 28
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1169,
                        "win_rate": 44.9,
                        "rank": 35
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1251,
                        "win_rate": 50,
                        "rank": 32
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1161,
                        "win_rate": 40.9,
                        "rank": 64
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1263,
                        "win_rate": 50.7,
                        "rank": 28
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1213,
                        "win_rate": 49,
                        "rank": 25
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1217,
                        "win_rate": 45.9,
                        "rank": 41
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1247,
                        "win_rate": 50.5,
                        "rank": 32
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 40.3,
                    "coding_index": 56.2,
                    "agentic_index": 31.1
                }
            },
            "reasoning": {
                "mandatory": false,
                "supported_efforts": [
                    "xhigh",
                    "high"
                ],
                "default_effort": "high"
            }
        },
        {
            "id": "anthropic/claude-opus-4.8",
            "canonical_slug": "anthropic/claude-4.8-opus-20260528",
            "hugging_face_id": null,
            "name": "Anthropic: Claude Opus 4.8",
            "created": 1779905091,
            "description": "Claude Opus 4.8 is Anthropic's most capable generally available model in the Opus family. It supports text, image, and file inputs with text output, with reasoning support and a 1M-token...",
            "context_length": 1000000,
            "architecture": {
                "modality": "text+image+file->text",
                "input_modalities": [
                    "text",
                    "image",
                    "file"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Claude",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.000005",
                "completion": "0.000025",
                "web_search": "0.01",
                "input_cache_read": "0.0000005",
                "input_cache_write": "0.00000625",
                "input_cache_write_1h": "0.00001"
            },
            "top_provider": {
                "context_length": 1000000,
                "max_completion_tokens": 128000,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "include_reasoning",
                "max_completion_tokens",
                "max_tokens",
                "reasoning",
                "response_format",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "verbosity"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/anthropic/claude-4.8-opus-20260528/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "agents",
                        "category": "agenticgamedev",
                        "elo": 1244,
                        "win_rate": 60.9,
                        "rank": 2
                    },
                    {
                        "arena": "agents",
                        "category": "agentichtmlslides",
                        "elo": 1227,
                        "win_rate": 55.6,
                        "rank": 4
                    },
                    {
                        "arena": "agents",
                        "category": "agenticslides",
                        "elo": 1294,
                        "win_rate": 64.8,
                        "rank": 2
                    },
                    {
                        "arena": "agents",
                        "category": "agenticslides(html)",
                        "elo": 1230,
                        "win_rate": 56,
                        "rank": 4
                    },
                    {
                        "arena": "agents",
                        "category": "agenticslides(python-pptx)",
                        "elo": 1310,
                        "win_rate": 68.9,
                        "rank": 2
                    },
                    {
                        "arena": "agents",
                        "category": "androidnative",
                        "elo": 1343,
                        "win_rate": 67.4,
                        "rank": 1
                    },
                    {
                        "arena": "agents",
                        "category": "fullstack",
                        "elo": 1318,
                        "win_rate": 65.5,
                        "rank": 2
                    },
                    {
                        "arena": "agents",
                        "category": "htmlslides",
                        "elo": 1221,
                        "win_rate": 55.4,
                        "rank": 4
                    },
                    {
                        "arena": "agents",
                        "category": "mobileapps",
                        "elo": 1279,
                        "win_rate": 58.9,
                        "rank": 2
                    },
                    {
                        "arena": "agents",
                        "category": "pptxslides",
                        "elo": 1306,
                        "win_rate": 67.9,
                        "rank": 2
                    },
                    {
                        "arena": "agents",
                        "category": "python-pptxslides",
                        "elo": 1298,
                        "win_rate": 65.9,
                        "rank": 2
                    },
                    {
                        "arena": "agents",
                        "category": "webapps",
                        "elo": 1286,
                        "win_rate": 54.9,
                        "rank": 2
                    },
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1289,
                        "win_rate": 56.4,
                        "rank": 22
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1303,
                        "win_rate": 62.1,
                        "rank": 6
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1279,
                        "win_rate": 54.6,
                        "rank": 23
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1282,
                        "win_rate": 55.9,
                        "rank": 16
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1301,
                        "win_rate": 54.8,
                        "rank": 15
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1233,
                        "win_rate": 53.6,
                        "rank": 20
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1288,
                        "win_rate": 55.4,
                        "rank": 21
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1277,
                        "win_rate": 54.4,
                        "rank": 23
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 55.7,
                    "coding_index": 74.3,
                    "agentic_index": 47.2
                }
            },
            "reasoning": {
                "mandatory": false,
                "supported_efforts": [
                    "max",
                    "xhigh",
                    "high",
                    "medium",
                    "low"
                ],
                "default_effort": "medium"
            }
        },
        {
            "id": "stepfun/step-3.7-flash",
            "canonical_slug": "stepfun/step-3.7-flash-20260528",
            "hugging_face_id": "stepfun-ai/Step-3.7-Flash",
            "name": "StepFun: Step 3.7 Flash",
            "created": 1779985069,
            "description": "Step 3.7 Flash is StepFun's latest high-efficiency multimodal Mixture-of-Experts model. It pairs a 196B-parameter language backbone with a vision encoder for native image and video understanding, activating roughly 11B parameters...",
            "context_length": 256000,
            "architecture": {
                "modality": "text+image+video->text",
                "input_modalities": [
                    "text",
                    "image",
                    "video"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Other",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.0000002",
                "completion": "0.00000115",
                "input_cache_read": "0.00000004"
            },
            "top_provider": {
                "context_length": 256000,
                "max_completion_tokens": 256000,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "logit_bias",
                "logprobs",
                "max_tokens",
                "min_p",
                "presence_penalty",
                "reasoning",
                "repetition_penalty",
                "response_format",
                "seed",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_logprobs",
                "top_p"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/stepfun/step-3.7-flash-20260528/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1196,
                        "win_rate": 43.1,
                        "rank": 48
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1212,
                        "win_rate": 49.8,
                        "rank": 19
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1213,
                        "win_rate": 45.4,
                        "rank": 46
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1208,
                        "win_rate": 46.1,
                        "rank": 44
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1205,
                        "win_rate": 41.3,
                        "rank": 46
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1125,
                        "win_rate": 39.9,
                        "rank": 50
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1212,
                        "win_rate": 44.4,
                        "rank": 44
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1222,
                        "win_rate": 46.9,
                        "rank": 45
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 29.7,
                    "coding_index": 37.3,
                    "agentic_index": 21.5
                }
            },
            "reasoning": {
                "mandatory": true,
                "supported_efforts": [
                    "high",
                    "medium",
                    "low"
                ],
                "default_effort": "medium"
            }
        },
        {
            "id": "anthropic/claude-opus-4.7",
            "canonical_slug": "anthropic/claude-4.7-opus-20260416",
            "hugging_face_id": null,
            "name": "Anthropic: Claude Opus 4.7",
            "created": 1776351100,
            "description": "Opus 4.7 is the next generation of Anthropic's Opus family, built for long-running, asynchronous agents. Building on the coding and agentic strengths of Opus 4.6, it delivers stronger performance on...",
            "context_length": 1000000,
            "architecture": {
                "modality": "text+image+file->text",
                "input_modalities": [
                    "text",
                    "image",
                    "file"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Claude",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.000005",
                "completion": "0.000025",
                "web_search": "0.01",
                "input_cache_read": "0.0000005",
                "input_cache_write": "0.00000625",
                "input_cache_write_1h": "0.00001"
            },
            "top_provider": {
                "context_length": 1000000,
                "max_completion_tokens": 128000,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "include_reasoning",
                "max_completion_tokens",
                "max_tokens",
                "reasoning",
                "response_format",
                "stop",
                "structured_outputs",
                "tool_choice",
                "tools",
                "verbosity"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/anthropic/claude-4.7-opus-20260416/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "agents",
                        "category": "agenticgamedev",
                        "elo": 1275,
                        "win_rate": 63.4,
                        "rank": 1
                    },
                    {
                        "arena": "agents",
                        "category": "agentichtmlslides",
                        "elo": 1243,
                        "win_rate": 58,
                        "rank": 3
                    },
                    {
                        "arena": "agents",
                        "category": "agenticslides",
                        "elo": 1334,
                        "win_rate": 64.7,
                        "rank": 1
                    },
                    {
                        "arena": "agents",
                        "category": "agenticslides(html)",
                        "elo": 1242,
                        "win_rate": 57.8,
                        "rank": 3
                    },
                    {
                        "arena": "agents",
                        "category": "agenticslides(python-pptx)",
                        "elo": 1335,
                        "win_rate": 66.5,
                        "rank": 1
                    },
                    {
                        "arena": "agents",
                        "category": "androidnative",
                        "elo": 1323,
                        "win_rate": 61.7,
                        "rank": 2
                    },
                    {
                        "arena": "agents",
                        "category": "fullstack",
                        "elo": 1503,
                        "win_rate": 80.1,
                        "rank": 1
                    },
                    {
                        "arena": "agents",
                        "category": "godotgamedev",
                        "elo": 1211,
                        "win_rate": 50.8,
                        "rank": 11
                    },
                    {
                        "arena": "agents",
                        "category": "htmlslides",
                        "elo": 1238,
                        "win_rate": 57.6,
                        "rank": 3
                    },
                    {
                        "arena": "agents",
                        "category": "mobileapps",
                        "elo": 1192,
                        "win_rate": 50.9,
                        "rank": 16
                    },
                    {
                        "arena": "agents",
                        "category": "pptxslides",
                        "elo": 1344,
                        "win_rate": 67.3,
                        "rank": 1
                    },
                    {
                        "arena": "agents",
                        "category": "python-pptxslides",
                        "elo": 1351,
                        "win_rate": 66.3,
                        "rank": 1
                    },
                    {
                        "arena": "agents",
                        "category": "webapps",
                        "elo": 1330,
                        "win_rate": 65.5,
                        "rank": 1
                    },
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1322,
                        "win_rate": 59.3,
                        "rank": 10
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1329,
                        "win_rate": 66.8,
                        "rank": 2
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1333,
                        "win_rate": 60.6,
                        "rank": 4
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1322,
                        "win_rate": 61.5,
                        "rank": 6
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1343,
                        "win_rate": 63.1,
                        "rank": 6
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1280,
                        "win_rate": 61.4,
                        "rank": 6
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1364,
                        "win_rate": 64.5,
                        "rank": 2
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1332,
                        "win_rate": 60.3,
                        "rank": 4
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 53.5,
                    "coding_index": 73.6,
                    "agentic_index": 44.4
                }
            },
            "reasoning": {
                "mandatory": false,
                "supported_efforts": [
                    "max",
                    "xhigh",
                    "high",
                    "medium",
                    "low"
                ],
                "default_effort": "medium"
            }
        },
        {
            "id": "tencent/hy3:free",
            "canonical_slug": "tencent/hy3-20260706",
            "hugging_face_id": "tencent/Hy3",
            "name": "Tencent: Hy3 (free)",
            "created": 1783344048,
            "description": "Hy3 is a 295B-parameter Mixture-of-Experts model from Tencent (21B active, 192 experts with top-8 routing) built for reasoning, agentic workflows, and real-world production use. It supports a configurable reasoning effort:...",
            "context_length": 262144,
            "architecture": {
                "modality": "text->text",
                "input_modalities": [
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Other",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0",
                "completion": "0"
            },
            "top_provider": {
                "context_length": 262144,
                "max_completion_tokens": 262144,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "max_tokens",
                "presence_penalty",
                "reasoning",
                "repetition_penalty",
                "seed",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_p"
            ],
            "default_parameters": {
                "temperature": 0.9,
                "top_p": 1,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": "2026-07-21",
            "links": {
                "details": "/api/v1/models/tencent/hy3-20260706/endpoints"
            },
            "reasoning": {
                "mandatory": false,
                "default_enabled": false,
                "supported_efforts": [
                    "high",
                    "low",
                    "none"
                ],
                "default_effort": "high"
            }
        },
        {
            "id": "nvidia/nemotron-3-ultra-550b-a55b:free",
            "canonical_slug": "nvidia/nemotron-3-ultra-550b-a55b-20260604",
            "hugging_face_id": "nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16",
            "name": "NVIDIA: Nemotron 3 Ultra (free)",
            "created": 1780551208,
            "description": "NVIDIA Nemotron 3 Ultra is an open frontier-reasoning and orchestration model from NVIDIA, with 55B active parameters out of 550B total (MoE). Built on a hybrid Transformer-Mamba mixture-of-experts architecture, it...",
            "context_length": 1000000,
            "architecture": {
                "modality": "text->text",
                "input_modalities": [
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Other",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0",
                "completion": "0"
            },
            "top_provider": {
                "context_length": 1000000,
                "max_completion_tokens": 65536,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "include_reasoning",
                "max_tokens",
                "reasoning",
                "seed",
                "temperature",
                "tool_choice",
                "tools",
                "top_p"
            ],
            "default_parameters": {
                "temperature": 1,
                "top_p": 0.95,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/nvidia/nemotron-3-ultra-550b-a55b-20260604/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1214,
                        "win_rate": 43.8,
                        "rank": 42
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1118,
                        "win_rate": 37.7,
                        "rank": 44
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1168,
                        "win_rate": 36.7,
                        "rank": 62
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1148,
                        "win_rate": 36.4,
                        "rank": 65
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1195,
                        "win_rate": 39.3,
                        "rank": 54
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1135,
                        "win_rate": 37.9,
                        "rank": 48
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1174,
                        "win_rate": 37.7,
                        "rank": 56
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1136,
                        "win_rate": 32.5,
                        "rank": 78
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 37.8,
                    "coding_index": 49.3,
                    "agentic_index": 27.4
                }
            },
            "reasoning": {
                "mandatory": false,
                "default_enabled": true,
                "supports_max_tokens": true,
                "supported_efforts": [
                    "high",
                    "medium"
                ],
                "default_effort": "high"
            }
        },
        {
            "id": "tencent/hy3-preview",
            "canonical_slug": "tencent/hy3-preview-20260421",
            "hugging_face_id": "tencent/Hy3-preview",
            "name": "Tencent: Hy3 preview",
            "created": 1776878150,
            "description": "Hy3 preview is a high-efficiency Mixture-of-Experts model from Tencent designed for agentic workflows and production use. It supports configurable reasoning levels across disabled, low, and high modes, allowing it to...",
            "context_length": 262144,
            "architecture": {
                "modality": "text->text",
                "input_modalities": [
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Other",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.000000063",
                "completion": "0.00000021",
                "input_cache_read": "0.000000021"
            },
            "top_provider": {
                "context_length": 262144,
                "max_completion_tokens": null,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "max_tokens",
                "presence_penalty",
                "reasoning",
                "seed",
                "stop",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_p"
            ],
            "default_parameters": {
                "temperature": 0.9,
                "top_p": 1,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/tencent/hy3-preview-20260421/endpoints"
            },
            "reasoning": {
                "mandatory": false,
                "default_enabled": true,
                "supported_efforts": [
                    "high",
                    "low",
                    "none"
                ],
                "default_effort": "high"
            }
        },
        {
            "id": "xiaomi/mimo-v2.5-pro",
            "canonical_slug": "xiaomi/mimo-v2.5-pro-20260422",
            "hugging_face_id": "XiaomiMiMo/MiMo-V2.5-Pro",
            "name": "Xiaomi: MiMo-V2.5-Pro",
            "created": 1776874273,
            "description": "MiMo-V2.5-Pro is Xiaomi’s flagship model, delivering strong performance in general agentic capabilities, complex software engineering, and long-horizon tasks, with top rankings on benchmarks such as ClawEval, GDPVal, and SWE-bench Pro....",
            "context_length": 1048576,
            "architecture": {
                "modality": "text->text",
                "input_modalities": [
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Other",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.000000435",
                "completion": "0.00000087",
                "input_cache_read": "0.0000000036"
            },
            "top_provider": {
                "context_length": 1048576,
                "max_completion_tokens": 131072,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "logit_bias",
                "logprobs",
                "max_tokens",
                "min_p",
                "presence_penalty",
                "reasoning",
                "repetition_penalty",
                "response_format",
                "seed",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_logprobs",
                "top_p"
            ],
            "default_parameters": {
                "temperature": 1,
                "top_p": 0.95,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/xiaomi/mimo-v2.5-pro-20260422/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1321,
                        "win_rate": 57.2,
                        "rank": 12
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1198,
                        "win_rate": 50,
                        "rank": 24
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1315,
                        "win_rate": 57.5,
                        "rank": 11
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1291,
                        "win_rate": 57.9,
                        "rank": 11
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1338,
                        "win_rate": 61.1,
                        "rank": 7
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1234,
                        "win_rate": 54.5,
                        "rank": 19
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1300,
                        "win_rate": 55.7,
                        "rank": 16
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1307,
                        "win_rate": 56.3,
                        "rank": 12
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 42.2,
                    "coding_index": 60.2,
                    "agentic_index": 29.1
                }
            },
            "reasoning": {
                "mandatory": false
            }
        },
        {
            "id": "openai/gpt-5.5",
            "canonical_slug": "openai/gpt-5.5-20260423",
            "hugging_face_id": "",
            "name": "OpenAI: GPT-5.5",
            "created": 1777051893,
            "description": "GPT-5.5 is OpenAI’s frontier model designed for complex professional workloads, building on GPT-5.4 with stronger reasoning, higher reliability, and improved token efficiency on hard tasks. It features a 1M+ token...",
            "context_length": 1050000,
            "architecture": {
                "modality": "text+image+file->text",
                "input_modalities": [
                    "file",
                    "image",
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "GPT",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.000005",
                "completion": "0.00003",
                "web_search": "0.01",
                "input_cache_read": "0.0000005"
            },
            "top_provider": {
                "context_length": 1050000,
                "max_completion_tokens": 128000,
                "is_moderated": true
            },
            "per_request_limits": null,
            "supported_parameters": [
                "include_reasoning",
                "max_completion_tokens",
                "max_tokens",
                "reasoning",
                "response_format",
                "seed",
                "structured_outputs",
                "tool_choice",
                "tools"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": "2025-12-01",
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/openai/gpt-5.5-20260423/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "agents",
                        "category": "agenticgamedev",
                        "elo": 1200,
                        "win_rate": 53,
                        "rank": 5
                    },
                    {
                        "arena": "agents",
                        "category": "agentichtmlslides",
                        "elo": 1084,
                        "win_rate": 34.2,
                        "rank": 9
                    },
                    {
                        "arena": "agents",
                        "category": "agenticslides",
                        "elo": 1150,
                        "win_rate": 43.5,
                        "rank": 7
                    },
                    {
                        "arena": "agents",
                        "category": "agenticslides(html)",
                        "elo": 1077,
                        "win_rate": 33.2,
                        "rank": 9
                    },
                    {
                        "arena": "agents",
                        "category": "agenticslides(python-pptx)",
                        "elo": 1155,
                        "win_rate": 45.2,
                        "rank": 7
                    },
                    {
                        "arena": "agents",
                        "category": "androidnative",
                        "elo": 1260,
                        "win_rate": 55.3,
                        "rank": 4
                    },
                    {
                        "arena": "agents",
                        "category": "fullstack",
                        "elo": 1147,
                        "win_rate": 44.3,
                        "rank": 17
                    },
                    {
                        "arena": "agents",
                        "category": "godotgamedev",
                        "elo": 1215,
                        "win_rate": 53,
                        "rank": 10
                    },
                    {
                        "arena": "agents",
                        "category": "htmlslides",
                        "elo": 1085,
                        "win_rate": 34.6,
                        "rank": 12
                    },
                    {
                        "arena": "agents",
                        "category": "mobileapps",
                        "elo": 1217,
                        "win_rate": 50.7,
                        "rank": 11
                    },
                    {
                        "arena": "agents",
                        "category": "pptxslides",
                        "elo": 1157,
                        "win_rate": 45.3,
                        "rank": 7
                    },
                    {
                        "arena": "agents",
                        "category": "python-pptxslides",
                        "elo": 1152,
                        "win_rate": 43.3,
                        "rank": 9
                    },
                    {
                        "arena": "agents",
                        "category": "webapps",
                        "elo": 1183,
                        "win_rate": 45.3,
                        "rank": 18
                    },
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1264,
                        "win_rate": 53.1,
                        "rank": 30
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1300,
                        "win_rate": 61.4,
                        "rank": 7
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1294,
                        "win_rate": 56.7,
                        "rank": 17
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1301,
                        "win_rate": 58.4,
                        "rank": 9
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1348,
                        "win_rate": 62.8,
                        "rank": 3
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1284,
                        "win_rate": 60,
                        "rank": 5
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1300,
                        "win_rate": 57.1,
                        "rank": 15
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1289,
                        "win_rate": 56,
                        "rank": 18
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 54.8,
                    "coding_index": 74.9,
                    "agentic_index": 44.9
                }
            },
            "reasoning": {
                "mandatory": false,
                "default_enabled": true,
                "supported_efforts": [
                    "xhigh",
                    "high",
                    "medium",
                    "low",
                    "none"
                ],
                "default_effort": "medium"
            }
        },
        {
            "id": "z-ai/glm-5",
            "canonical_slug": "z-ai/glm-5-20260211",
            "hugging_face_id": "zai-org/GLM-5",
            "name": "Z.ai: GLM 5",
            "created": 1770829182,
            "description": "GLM-5 is Z.ai’s flagship open-source foundation model engineered for complex systems design and long-horizon agent workflows. Built for expert developers, it delivers production-grade performance on large-scale programming tasks, rivaling leading...",
            "context_length": 202752,
            "architecture": {
                "modality": "text->text",
                "input_modalities": [
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Other",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.0000006",
                "completion": "0.00000192",
                "input_cache_read": "0.00000012"
            },
            "top_provider": {
                "context_length": 202752,
                "max_completion_tokens": null,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "logit_bias",
                "logprobs",
                "max_tokens",
                "min_p",
                "presence_penalty",
                "reasoning",
                "repetition_penalty",
                "response_format",
                "seed",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_logprobs",
                "top_p"
            ],
            "default_parameters": {
                "temperature": 1,
                "top_p": 0.95,
                "frequency_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/z-ai/glm-5-20260211/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "agents",
                        "category": "androidnative",
                        "elo": 1243,
                        "win_rate": 61.5,
                        "rank": 8
                    },
                    {
                        "arena": "agents",
                        "category": "fullstack",
                        "elo": 1184,
                        "win_rate": 52.6,
                        "rank": 15
                    },
                    {
                        "arena": "agents",
                        "category": "godotgamedev",
                        "elo": 1231,
                        "win_rate": 54.8,
                        "rank": 4
                    },
                    {
                        "arena": "agents",
                        "category": "htmlslides",
                        "elo": 1164,
                        "win_rate": 44.4,
                        "rank": 10
                    },
                    {
                        "arena": "agents",
                        "category": "mobileapps",
                        "elo": 1215,
                        "win_rate": 53,
                        "rank": 12
                    },
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1305,
                        "win_rate": 56.4,
                        "rank": 18
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1195,
                        "win_rate": 48,
                        "rank": 26
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1292,
                        "win_rate": 55.5,
                        "rank": 18
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1268,
                        "win_rate": 53,
                        "rank": 23
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1299,
                        "win_rate": 57.4,
                        "rank": 16
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1224,
                        "win_rate": 54.4,
                        "rank": 21
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1285,
                        "win_rate": 54,
                        "rank": 22
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1287,
                        "win_rate": 55,
                        "rank": 20
                    }
                ]
            },
            "reasoning": {
                "mandatory": false,
                "default_enabled": true
            }
        },
        {
            "id": "anthropic/claude-sonnet-4.6",
            "canonical_slug": "anthropic/claude-4.6-sonnet-20260217",
            "hugging_face_id": "",
            "name": "Anthropic: Claude Sonnet 4.6",
            "created": 1771342990,
            "description": "Sonnet 4.6 is Anthropic's most capable Sonnet-class model yet, with frontier performance across coding, agents, and professional work. It excels at iterative development, complex codebase navigation, end-to-end project management with...",
            "context_length": 1000000,
            "architecture": {
                "modality": "text+image+file->text",
                "input_modalities": [
                    "text",
                    "image",
                    "file"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Claude",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.000003",
                "completion": "0.000015",
                "web_search": "0.01",
                "input_cache_read": "0.0000003",
                "input_cache_write": "0.00000375",
                "input_cache_write_1h": "0.000006"
            },
            "top_provider": {
                "context_length": 1000000,
                "max_completion_tokens": 128000,
                "is_moderated": true
            },
            "per_request_limits": null,
            "supported_parameters": [
                "include_reasoning",
                "max_completion_tokens",
                "max_tokens",
                "reasoning",
                "response_format",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_p",
                "verbosity"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/anthropic/claude-4.6-sonnet-20260217/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "agents",
                        "category": "agenticgamedev",
                        "elo": 1189,
                        "win_rate": 50.9,
                        "rank": 6
                    },
                    {
                        "arena": "agents",
                        "category": "androidnative",
                        "elo": 1234,
                        "win_rate": 61.9,
                        "rank": 9
                    },
                    {
                        "arena": "agents",
                        "category": "fullstack",
                        "elo": 1267,
                        "win_rate": 63.1,
                        "rank": 6
                    },
                    {
                        "arena": "agents",
                        "category": "godotgamedev",
                        "elo": 1271,
                        "win_rate": 60.6,
                        "rank": 1
                    },
                    {
                        "arena": "agents",
                        "category": "mobileapps",
                        "elo": 1250,
                        "win_rate": 59.2,
                        "rank": 5
                    },
                    {
                        "arena": "agents",
                        "category": "webapps",
                        "elo": 1248,
                        "win_rate": 55.8,
                        "rank": 8
                    },
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1312,
                        "win_rate": 58.8,
                        "rank": 15
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1277,
                        "win_rate": 60.5,
                        "rank": 8
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1322,
                        "win_rate": 61.1,
                        "rank": 8
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1321,
                        "win_rate": 61.4,
                        "rank": 7
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1322,
                        "win_rate": 60.4,
                        "rank": 12
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1254,
                        "win_rate": 59.4,
                        "rank": 11
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1326,
                        "win_rate": 61.8,
                        "rank": 7
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1324,
                        "win_rate": 61.5,
                        "rank": 6
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 47.2,
                    "coding_index": 63,
                    "agentic_index": 40.8
                }
            },
            "reasoning": {
                "mandatory": false,
                "supported_efforts": [
                    "max",
                    "high",
                    "medium",
                    "low"
                ],
                "default_effort": "medium"
            }
        },
        {
            "id": "openai/gpt-5.4",
            "canonical_slug": "openai/gpt-5.4-20260305",
            "hugging_face_id": "",
            "name": "OpenAI: GPT-5.4",
            "created": 1772734352,
            "description": "GPT-5.4 is OpenAI’s latest frontier model, unifying the Codex and GPT lines into a single system. It features a 1M+ token context window (922K input, 128K output) with support for...",
            "context_length": 1050000,
            "architecture": {
                "modality": "text+image+file->text",
                "input_modalities": [
                    "text",
                    "image",
                    "file"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "GPT",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.0000025",
                "completion": "0.000015",
                "web_search": "0.01",
                "input_cache_read": "0.00000025"
            },
            "top_provider": {
                "context_length": 1050000,
                "max_completion_tokens": 128000,
                "is_moderated": true
            },
            "per_request_limits": null,
            "supported_parameters": [
                "include_reasoning",
                "max_completion_tokens",
                "max_tokens",
                "reasoning",
                "response_format",
                "seed",
                "structured_outputs",
                "tool_choice",
                "tools"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/openai/gpt-5.4-20260305/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1177,
                        "win_rate": 42.3,
                        "rank": 52
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1244,
                        "win_rate": 55.3,
                        "rank": 11
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1257,
                        "win_rate": 52.6,
                        "rank": 30
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1275,
                        "win_rate": 56.7,
                        "rank": 20
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1305,
                        "win_rate": 57.9,
                        "rank": 14
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1251,
                        "win_rate": 57.8,
                        "rank": 14
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1293,
                        "win_rate": 57.6,
                        "rank": 17
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1258,
                        "win_rate": 52.6,
                        "rank": 30
                    },
                    {
                        "arena": "agents",
                        "category": "androidnative",
                        "elo": 1038,
                        "win_rate": 47.4,
                        "rank": 27
                    },
                    {
                        "arena": "agents",
                        "category": "fullstack",
                        "elo": 1079,
                        "win_rate": 40.8,
                        "rank": 26
                    },
                    {
                        "arena": "agents",
                        "category": "godotgamedev",
                        "elo": 1177,
                        "win_rate": 46.9,
                        "rank": 14
                    },
                    {
                        "arena": "agents",
                        "category": "mobileapps",
                        "elo": 1146,
                        "win_rate": 44.4,
                        "rank": 26
                    },
                    {
                        "arena": "agents",
                        "category": "webapps",
                        "elo": 1139,
                        "win_rate": 41.7,
                        "rank": 20
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 51.4,
                    "coding_index": 71.1,
                    "agentic_index": 41.1
                }
            },
            "reasoning": {
                "mandatory": false,
                "default_enabled": false,
                "supported_efforts": [
                    "xhigh",
                    "high",
                    "medium",
                    "low",
                    "none"
                ],
                "default_effort": "medium"
            }
        },
        {
            "id": "poolside/laguna-m.1:free",
            "canonical_slug": "poolside/laguna-m.1-20260312",
            "hugging_face_id": "poolside/Laguna-M.1",
            "name": "Poolside: Laguna M.1 (free)",
            "created": 1777388504,
            "description": "Laguna M.1 is the flagship coding agent model from [Poolside](https://poolside.ai/), optimized for complex software engineering tasks. Designed for agentic coding workflows, it supports tool calling and reasoning, with a 256K...",
            "context_length": 262144,
            "architecture": {
                "modality": "text->text",
                "input_modalities": [
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Other",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0",
                "completion": "0"
            },
            "top_provider": {
                "context_length": 262144,
                "max_completion_tokens": 32768,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "include_reasoning",
                "max_tokens",
                "reasoning",
                "temperature",
                "tool_choice",
                "tools"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/poolside/laguna-m.1-20260312/endpoints"
            },
            "reasoning": {
                "mandatory": false,
                "default_enabled": true
            }
        },
        {
            "id": "google/gemini-3-flash-preview",
            "canonical_slug": "google/gemini-3-flash-preview-20251217",
            "hugging_face_id": "",
            "name": "Google: Gemini 3 Flash Preview",
            "created": 1765987078,
            "description": "Gemini 3 Flash Preview is a high speed, high value thinking model designed for agentic workflows, multi turn chat, and coding assistance. It delivers near Pro level reasoning and tool...",
            "context_length": 1048576,
            "architecture": {
                "modality": "text+image+file+audio+video->text",
                "input_modalities": [
                    "text",
                    "image",
                    "file",
                    "audio",
                    "video"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Gemini",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.0000005",
                "completion": "0.000003",
                "image": "0.0000005",
                "audio": "0.000001",
                "web_search": "0.014",
                "internal_reasoning": "0.000003",
                "input_cache_read": "0.00000005",
                "input_cache_write": "0.00000008333333333333334"
            },
            "top_provider": {
                "context_length": 1048576,
                "max_completion_tokens": 65535,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "include_reasoning",
                "max_tokens",
                "reasoning",
                "response_format",
                "seed",
                "stop",
                "structured_outputs",
                "temperature",
                "tool_choice",
                "tools",
                "top_p"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/google/gemini-3-flash-preview-20251217/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "agents",
                        "category": "agenticslides",
                        "elo": 1073,
                        "win_rate": 39.3,
                        "rank": 9
                    },
                    {
                        "arena": "agents",
                        "category": "agenticslides(python-pptx)",
                        "elo": 1075,
                        "win_rate": 39.3,
                        "rank": 9
                    },
                    {
                        "arena": "agents",
                        "category": "androidnative",
                        "elo": 1060,
                        "win_rate": 48,
                        "rank": 25
                    },
                    {
                        "arena": "agents",
                        "category": "fullstack",
                        "elo": 1124,
                        "win_rate": 47.1,
                        "rank": 19
                    },
                    {
                        "arena": "agents",
                        "category": "godotgamedev",
                        "elo": 1218,
                        "win_rate": 52.3,
                        "rank": 8
                    },
                    {
                        "arena": "agents",
                        "category": "mobileapps",
                        "elo": 1181,
                        "win_rate": 49.8,
                        "rank": 18
                    },
                    {
                        "arena": "agents",
                        "category": "webapps",
                        "elo": 1187,
                        "win_rate": 49.5,
                        "rank": 17
                    },
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1260,
                        "win_rate": 62.7,
                        "rank": 31
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1235,
                        "win_rate": 57.6,
                        "rank": 35
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1232,
                        "win_rate": 58.3,
                        "rank": 39
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1235,
                        "win_rate": 57,
                        "rank": 36
                    }
                ]
            },
            "reasoning": {
                "mandatory": false,
                "supported_efforts": [
                    "high",
                    "medium",
                    "low",
                    "minimal"
                ],
                "default_effort": "medium"
            }
        },
        {
            "id": "cohere/north-mini-code:free",
            "canonical_slug": "cohere/north-mini-code-20260617",
            "hugging_face_id": "CohereLabs/North-Mini-Code-1.0",
            "name": "Cohere: North Mini Code (free)",
            "created": 1781723748,
            "description": "North Mini Code is Cohere's first agentic coding model and the debut of its North family. A sparse mixture-of-experts model with 30B total parameters and 3B active, it is optimized...",
            "context_length": 256000,
            "architecture": {
                "modality": "text->text",
                "input_modalities": [
                    "text"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Cohere",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0",
                "completion": "0"
            },
            "top_provider": {
                "context_length": 256000,
                "max_completion_tokens": 64000,
                "is_moderated": true
            },
            "per_request_limits": null,
            "supported_parameters": [
                "frequency_penalty",
                "include_reasoning",
                "max_tokens",
                "presence_penalty",
                "reasoning",
                "seed",
                "stop",
                "temperature",
                "tool_choice",
                "tools",
                "top_k",
                "top_p"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/cohere/north-mini-code-20260617/endpoints"
            },
            "benchmarks": {
                "design_arena": [],
                "artificial_analysis": {
                    "intelligence_index": null,
                    "coding_index": 36.5,
                    "agentic_index": null
                }
            },
            "reasoning": {
                "mandatory": false
            }
        },
        {
            "id": "anthropic/claude-sonnet-5",
            "canonical_slug": "anthropic/claude-sonnet-5-20260630",
            "hugging_face_id": null,
            "name": "Anthropic: Claude Sonnet 5",
            "created": 1782843083,
            "description": "Sonnet 5 is Anthropic's most capable Sonnet-class model, with frontier performance across coding, agents, and professional work. It supports adaptive thinking with selectable reasoning effort levels (low, medium, high, max,...",
            "context_length": 1000000,
            "architecture": {
                "modality": "text+image+file->text",
                "input_modalities": [
                    "text",
                    "image",
                    "file"
                ],
                "output_modalities": [
                    "text"
                ],
                "tokenizer": "Claude",
                "instruct_type": null
            },
            "pricing": {
                "prompt": "0.000002",
                "completion": "0.00001",
                "web_search": "0.01",
                "input_cache_read": "0.0000002",
                "input_cache_write": "0.0000025",
                "input_cache_write_1h": "0.000004"
            },
            "top_provider": {
                "context_length": 1000000,
                "max_completion_tokens": 128000,
                "is_moderated": false
            },
            "per_request_limits": null,
            "supported_parameters": [
                "include_reasoning",
                "max_completion_tokens",
                "max_tokens",
                "reasoning",
                "response_format",
                "stop",
                "structured_outputs",
                "tool_choice",
                "tools",
                "verbosity"
            ],
            "default_parameters": {
                "temperature": null,
                "top_p": null,
                "top_k": null,
                "frequency_penalty": null,
                "presence_penalty": null,
                "repetition_penalty": null
            },
            "supported_voices": null,
            "knowledge_cutoff": null,
            "expiration_date": null,
            "links": {
                "details": "/api/v1/models/anthropic/claude-sonnet-5-20260630/endpoints"
            },
            "benchmarks": {
                "design_arena": [
                    {
                        "arena": "models",
                        "category": "3d",
                        "elo": 1321,
                        "win_rate": 56.9,
                        "rank": 11
                    },
                    {
                        "arena": "models",
                        "category": "asciiart",
                        "elo": 1225,
                        "win_rate": 50.7,
                        "rank": 13
                    },
                    {
                        "arena": "models",
                        "category": "codecategories",
                        "elo": 1315,
                        "win_rate": 56.8,
                        "rank": 9
                    },
                    {
                        "arena": "models",
                        "category": "dataviz",
                        "elo": 1281,
                        "win_rate": 54.5,
                        "rank": 17
                    },
                    {
                        "arena": "models",
                        "category": "gamedev",
                        "elo": 1345,
                        "win_rate": 59.9,
                        "rank": 4
                    },
                    {
                        "arena": "models",
                        "category": "svg",
                        "elo": 1254,
                        "win_rate": 54.9,
                        "rank": 12
                    },
                    {
                        "arena": "models",
                        "category": "uicomponent",
                        "elo": 1316,
                        "win_rate": 56.3,
                        "rank": 11
                    },
                    {
                        "arena": "models",
                        "category": "website",
                        "elo": 1317,
                        "win_rate": 57.7,
                        "rank": 7
                    }
                ],
                "artificial_analysis": {
                    "intelligence_index": 53.4,
                    "coding_index": 71.5,
                    "agentic_index": 46.7
                }
            },
            "reasoning": {
                "mandatory": false,
                "supported_efforts": [
                    "max",
                    "xhigh",
                    "high",
                    "medium",
                    "low"
                ],
                "default_effort": "medium"
            }
        }
    ]
}
```
